import { sql } from '@/lib/db-connection'
import {
  CustomerField,
  CustomerForm,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions'
import { formatCurrency, formatDateToMonth } from './utils'
import { QueryResult, QueryResultRow } from '@vercel/postgres'

export async function fetchRevenue() {
  try {
    const data = await sql<Revenue>`SELECT * FROM revenue`

    return data.rows
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch revenue data.')
  }
}

export async function fetchLatestInvoices(limit: number = 5) {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.created_at DESC
      LIMIT ${limit}`

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }))
    return latestInvoices
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch the latest invoices.')
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`
    const invoiceStatusPromise = sql`SELECT
    SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
    SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
    FROM invoices`

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ])

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0')
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0')
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0')
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0')

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    }
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch card data.')
  }
}

export function generateLikeClausesForInvoices(inputArray: string[]) {
  if (!Array.isArray(inputArray) || inputArray.length === 0) {
    throw new Error('Input must be a non-empty array of strings.')
  }

  // Prepare parameters with % wildcard for LIKE
  const params = inputArray.map((value) => `%${value}%`)

  // Build the dynamic query
  const likeClauses = inputArray
    .map(
      (_, index) => `
        (customers.name LIKE $${index + 1} OR
        invoices.amount::text LIKE $${index + 1} OR
        customers.email LIKE $${index + 1} OR
        invoices.created_at::text LIKE $${index + 1} OR
        invoices.status LIKE $${index + 1})
      `
    )
    .join(' AND ')

  return { likeClauses, params }
}
export function generateLikeClausesForCustomers(inputArray: string[]) {
  if (!Array.isArray(inputArray) || inputArray.length === 0) {
    throw new Error('Input must be a non-empty array of strings.')
  }

  // Prepare parameters with % wildcard for LIKE
  const params = inputArray.map((value) => `%${value}%`)

  // Build the dynamic query
  const likeClauses = inputArray
    .map(
      (_, index) => `
        customers.name LIKE $${index + 1} OR
        customers.email LIKE $${index + 1}
      `
    )
    .join(' OR ')

  return { likeClauses, params }
}

const ITEMS_PER_PAGE = 6
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE

  try {
    const queries = query.split(',')
    const { likeClauses, params } = generateLikeClausesForInvoices(queries)

    const sqlQuery = `SELECT
    invoices.id,
    invoices.amount,
    invoices.created_at,
    invoices.status,
    customers.name,
    customers.email,
    customers.image_url
     FROM invoices
     JOIN customers ON invoices.customer_id = customers.id
     WHERE ${likeClauses}
     ORDER BY invoices.created_at DESC
     LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
     `

    // Execute the query
    const result = await sql.query<InvoicesTable>(sqlQuery, params)

    return result.rows
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch invoices.')
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const queries = query.split(',')
    const { likeClauses, params } = generateLikeClausesForInvoices(queries)

    const sqlQuery = `SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE ${likeClauses}
  `
    const count = await sql.query(sqlQuery, params)

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE)
    return totalPages
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch total number of invoices.')
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
        invoices.due_at
      FROM invoices
      WHERE invoices.id = ${id};
    `

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }))

    return invoice[0]
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch invoice.')
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `

    const customers = data.rows
    return customers
  } catch (err) {
    console.error('Database Error:', err)
    throw new Error('Failed to fetch all customers.')
  }
}

export async function fetchCustomersPages(query: string) {
  try {
    const queries = query.split(',')
    const { likeClauses, params } = generateLikeClausesForCustomers(queries)
    const sqlQuery = `SELECT COUNT(*)
    FROM customers
    WHERE ${likeClauses}
    `
    const count = await sql.query(sqlQuery, params)

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE)
    return totalPages
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch total number of customers.')
  }
}

export async function fetchCustomerById(id: string) {
  try {
    const data = await sql<CustomerForm>`
      SELECT
        id,
        name,
        email,
        image_url
      FROM customers
      WHERE id = ${id}
    `

    const customer = data.rows[0]
    return customer
  } catch (err) {
    console.error('Database Error:', err)
    throw new Error('Failed to fetch customers')
  }
}

export async function fetchFilteredCustomers(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE
  try {
    const queries = query.split(',')
    const { likeClauses, params } = generateLikeClausesForCustomers(queries)

    const sqlQuery = `
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE ${likeClauses}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
	  `
    const data = await sql.query<CustomersTableType>(sqlQuery, params)

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }))

    return customers
  } catch (err) {
    console.error('Database Error:', err)
    throw new Error('Failed to fetch customer table.')
  }
}

type ParamTypes = {
  searchParams?: Promise<{
    [key: string]: string | undefined
    page?: string
  }>
}
export const searchQuery: string = 'query'
export async function getUrlParams(params: ParamTypes) {
  const searchParams = await params.searchParams
  const query = searchParams?.[searchQuery] || ''
  const currentPage = Number(searchParams?.page) || 1

  return {
    query,
    currentPage,
    searchQuery,
  }
}

// Ensure all months are present
const allMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const formatRevenueData = (
  revenue: QueryResult<QueryResultRow>,
  suffix: string
) => {
  const currentYear = new Date().getFullYear()
  const lastYear = currentYear - 1

  const monthlyRevenueData = revenue.rows.reduce((acc, row) => {
    const month = formatDateToMonth(row.month)
    const year = row.year.getFullYear()

    if (!acc[month]) {
      acc[month] = {
        date: month,
        [`This year ${suffix}`]: 0,
        [`Last year ${suffix}`]: 0,
      }
    }

    if (year === currentYear) {
      acc[month][`This year ${suffix}`] = Number(row.total) / 100
    } else if (year === lastYear) {
      acc[month][`Last year ${suffix}`] = Number(row.total) / 100
    }

    return acc
  }, {})

  allMonths.forEach((month) => {
    if (!monthlyRevenueData[month]) {
      monthlyRevenueData[month] = {
        date: month,
        [`This year ${suffix}`]: 0,
        [`Last year ${suffix}`]: 0,
      }
    }
  })

  const monthlyRevenueArray = Object.values(monthlyRevenueData)
  monthlyRevenueArray.sort(
    (a, b) => allMonths.indexOf(a.date) - allMonths.indexOf(b.date)
  )
  return monthlyRevenueArray
}

export type RevenueData = {
  date: string
  'This year revenue': number
  'Last year revenue': number
  'This year debt': number
  'Last year debt': number
}[]

export const fetchRevenueData = async (): Promise<RevenueData> => {
  const monthlyRevenue = await sql`
    SELECT
      DATE_TRUNC('month', paid_at) AS month,
      DATE_TRUNC('year', paid_at) AS year,
      SUM(amount) AS total
    FROM invoices
    WHERE status = 'paid'
    GROUP BY month, year
    ORDER BY year, month
  `

  const overduePendingInvoices = await sql`
    SELECT
      DATE_TRUNC('month', due_at) AS month,
      DATE_TRUNC('year', due_at) AS year,
      SUM(amount) * -1 AS total
    FROM invoices
    WHERE status = 'pending' AND due_at < NOW()
    GROUP BY month, year
    ORDER BY year, month
  `
  const revenue = formatRevenueData(monthlyRevenue, 'revenue')
  const overduePending = formatRevenueData(overduePendingInvoices, 'debt')
  const mergedData = revenue.map((rev, i) => {
    return {
      ...rev,
      ...overduePending[i],
    }
  })

  return mergedData
}
