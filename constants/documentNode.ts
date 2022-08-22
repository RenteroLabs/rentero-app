import { gql } from '@apollo/client'

export const GET_LEASES = gql`
  query($skip: Int!, $pageSize: Int!) {
    leases(skip: $skip, first: $pageSize) {
        deposit
        daysPerPeriod
        erc20Address
        expires
        id
        lender
        maxRentalDays
        minRentalDays
        nftAddress
        rentPerDay
        renter
        status
        tokenId
        whitelist
    }
  }
`

export const GET_LEASE_INFO = gql`
  query($id: String!) {
    lease(id: $id) {
      deposit
      daysPerPeriod
      erc20Address
      expires
      id
      lender
      minRentalDays
      maxRentalDays
      nftAddress
      rentPerDay
      renter
      status
      tokenId
      whitelist
    }
  }
`

export const GET_MY_RENTING = gql`
  query($renter: String!) {
    leases(where: { renter: $renter}) {
        deposit
        daysPerPeriod
        erc20Address
        expires
        id
        lender
        maxRentalDays
        minRentalDays
        nftAddress
        rentPerDay
        renter
        status
        tokenId
        whitelist
    } 
  }
`

export const GET_MY_LENDING = gql`
  query($lender: String!) {
    leases(where: { lender: $lender}) {
        deposit
        daysPerPeriod
        erc20Address
        expires
        id
        lender
        maxRentalDays
        minRentalDays
        nftAddress
        rentPerDay
        renter
        status
        tokenId
        whitelist 
    }
  }
`