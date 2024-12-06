import bcrypt from 'bcrypt'
import { db } from '@/lib/db-connection'
import { invoices, customers, revenue, users } from './placeholder-data'
import fs from 'fs/promises'
import amy from './customers/amy-burns.png'
import balazs from './customers/balazs-orban.png'
import delba from './customers/delba-de-oliveira.png'
import evil from './customers/evil-rabbit.png'
import lee from './customers/lee-robinson.png'
import michael from './customers/michael-novotny.png'
import { auth } from '@/auth/auth'
const images = [evil, delba, lee, michael, amy, balazs]

const client = await db.connect()

async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10)
      return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `
    })
  )

  return insertedUsers
}

async function seedInvoices() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

  await client.sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => client.sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  )

  return insertedInvoices
}

async function seedCustomers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

  await client.sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => client.sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  )

  return insertedCustomers
}

async function seedRevenue() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => client.sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `
    )
  )

  return insertedRevenue
}

export async function GET() {
  const user = await auth()

  if (!user || user?.user?.email !== process.env.ADMIN_EMAIL) {
    return Response.json({
      message:
        'Nice try, precautions have been taken to avoid this naughty behavior 🎅',
    })
  }
  // Drop all tables
  // check if user images exist in public/customers
  // create them if not
  try {
    customers.forEach(async (customer, i) => {
      const path = `public/customers/${customer.image_url}`
      try {
        const imageBuffer = Buffer.from(images[i].src.split(',')[1], 'base64')
        await fs.writeFile(path, new Uint8Array(imageBuffer))
      } catch (err) {
        console.error(`Error writing file ${path}:`, err)
      }
    })

    await client.sql`BEGIN`
    await seedUsers()
    await seedCustomers()
    await seedInvoices()
    await seedRevenue()
    await client.sql`COMMIT`

    return Response.json({ message: 'Database seeded successfully' })
  } catch (error) {
    await client.sql`ROLLBACK`
    return Response.json({ error }, { status: 500 })
  }
}
// export async function POST() {}
// export async function PUT() {}
// export async function PATCH() {}
// export async function DELETE() {}
// export async function HEAD() {}
// export async function OPTIONS() {}
