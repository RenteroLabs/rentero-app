import qs from 'qs'
import { BaseURL } from '../constants'
import { UserLoginParams } from '../types/service'

/**
 * user login
 * @param params 
 * @returns 
 */
export const userLogin = async (params: UserLoginParams) => {
  const data = await fetch(`${BaseURL}/user/login?${qs.stringify(params)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    // credentials: 'include',
    body: JSON.stringify(params)
  })
  return await data.json()
}

/**
 * 出借者列表
 * @returns 
 */
export const lenderList = async ({ token, pageIndex }: { token: string, pageIndex: number }) => {
  const data = await fetch(`${BaseURL}/order/lending/list?pageIndex=${pageIndex}`, {
    headers: {
      sessionToken: token
    }
  })
  return await data.json()
}

/**
 * 借用者列表
 * @returns 
 */
export const borrowerList = async ({ token, pageIndex }: { token: string, pageIndex: number }) => {
  const data = await fetch(`${BaseURL}/order/borrow/list?pageIndex=${pageIndex}`, {
    headers: {
      sessionToken: token
    }
  })
  return await data.json()
}

/**
 * dashboard overview data
 * @param token 
 * @returns 
 */
export const overviewData = async (token: string) => {
  const data = await fetch(`${BaseURL}/dashboard/statistics`, {
    headers: {
      sessionToken: token
    }
  })
  return await data.json()
}

/**
 * wallet account list
 * @param token 
 * @returns 
 */
export const getWalletList = async (token: string) => {
  const data = await fetch(`${BaseURL}/account/list`, {
    headers: {
      sessionToken: token
    }
  })
  return await data.json()
}

/**
 * 订单、账单记录
 * @param token 
 * @returns 
 */
export const getOperationRecord = async (token: string) => {
  const data = await fetch(`${BaseURL}/order/record/list`, {
    headers: {
      sessionToken: token
    }
  })
  return await data.json()
}