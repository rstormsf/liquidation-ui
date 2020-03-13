import React from 'react';
import moment from 'moment'
import {formatUserSummaryData} from '@aave/protocol-js'
import {fromWei, toBN} from 'web3-utils'
import logo from './logo.svg';
import './App.css';
import { useLiquidatorsQuery } from './apollo/generated';

function getCurrentTimestamp(): number {
  return Number(moment().format('X'));
}
const toDecimal = (symbol: any, amount: any) => {
  if(symbol === 'USDC') {
    const a = toBN(amount).div(toBN(10).pow(toBN(6))).toString()
    return a
  } else {
    return fromWei(amount)
  }
}

export function DataGrid() {
  const { data, loading } = useLiquidatorsQuery();
  if(loading) {
    return <h1>loading</h1>
  }
  if(!data?.userReserves || !data.reserves) {
    return <h1>NO DATA</h1>
  }

  const reserves = data.reserves;
  const userReserves = data.userReserves.map(userReserve => {
    return {
      ...userReserve,
      user: formatUserSummaryData(reserves, userReserve.user.reserves, userReserve.user.id, 120, getCurrentTimestamp())
    }
  }).filter(userReserve => Number(userReserve.user.healthFactor) < 1);

  return (
    <div className="DataGrid">
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <h3>READY</h3>
      {userReserves.map((userReserve, i) => (
        <div key={i} style={{borderColor: "black"}}>
          <hr></hr>
          <p>ID: {userReserve.user.id}</p>
          <b>BORROWS</b>
          <p>{userReserve.reserve.symbol}: {toDecimal(userReserve.reserve.symbol, userReserve.principalBorrows)}</p>
          <h4>HF: {userReserve.user.healthFactor}</h4>
          COLLATERALS
          {userReserve.user.reservesData.map((res, ii) => (
            <p key={ii}>
              {res.reserve.symbol}: {res.principalATokenBalance}
            </p>
          ))}
        </div>
      ))}
    </div>
);
}
