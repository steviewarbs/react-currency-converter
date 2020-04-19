//Importing the components from local storage to create a small currency converter application

import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow';

//Base URL is taken from the free API service hosted at https://exchangeratesapi.io/

const BASE_URL = "https://api.exchangeratesapi.io/latest"
//const RATES_URL = "https://api.exchangeratesapi.io/latest?symbols=USD,GBP"

//Create initial stae of the currency application

function App() {
  
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)

  let toAmount, fromAmount
  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchangeRate
  }
  else {
    toAmount = amount
    fromAmount = amount / exchangeRate
    
  }

  useEffect(() => {
    document.title = "X-Change"
 }, []);

  useEffect(() => {
    fetch(BASE_URL)
    .then(res => res.json())
    .then(data => {
      const firstCurrency = Object.keys(data.rates)[0];
      setCurrencyOptions([data.base, ...Object.keys(data.rates)])
      setFromCurrency(data.base)
      setToCurrency(firstCurrency)
      setExchangeRate(data.rates[firstCurrency])
    })
  }, [])


  useEffect(()=> {
    if(fromCurrency != null && toCurrency != null) {
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
      .then(res => res.json())
      .then(data => setExchangeRate(data.rates[toCurrency]))
    }

  }, [fromCurrency, toCurrency])


  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
  setAmount(e.target.value)
  setAmountInFromCurrency(false)
}



//Returns the application to the index.js file


return (

<React.Fragment>

  <h1>X-Change Currency</h1>
  <CurrencyRow
  currencyOptions={currencyOptions}
  selectedCurrency={fromCurrency}
  onChangeCurrency={e => setFromCurrency(e.target.value)}
  onChangeAmount={handleFromAmountChange}
  amount={fromAmount}/>

  <div className="equals">=</div>
  <CurrencyRow
  currencyOptions={currencyOptions}
  selectedCurrency={toCurrency}
  onChangeCurrency={e => setToCurrency(e.target.value)}
  onChangeAmount={handleToAmountChange}
  amount={toAmount}/>


</React.Fragment>

)};

export default App;
