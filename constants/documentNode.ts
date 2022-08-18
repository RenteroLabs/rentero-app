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
        maxRentalPeriods
        minRentalPeriods
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
      maxRentalPeriods
      minRentalPeriods
      nftAddress
      rentPerDay
      renter
      status
      tokenId
      whitelist
    }
  }
`