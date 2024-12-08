import bcrypt from 'bcrypt'
import { db } from '@/lib/db-connection'
import { invoices, customers, users } from './placeholder-data'
import fs from 'fs/promises'
import { auth } from '@/auth/auth'

const client = await db.connect()

async function dropDatabase() {
  await client.sql`DROP TABLE IF EXISTS users, invoices, customers, revenue;`
}

async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      token TEXT,
      verified BOOLEAN DEFAULT false,
      created_at DATE DEFAULT NOW()
    );
  `

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10)
      return client.sql`
        INSERT INTO users (id, name, email, password, token, verified)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, null, true)
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
      created_at DATE NOT NULL,
      paid_at DATE,
      due_at DATE NOT NULL
    );
  `

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => client.sql`
        INSERT INTO invoices (customer_id, amount, status, created_at, due_at, paid_at)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.created_at}, ${invoice.due_at}, ${invoice.paid_at})
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

// async function seedRevenue() {
//   await client.sql`
//     CREATE TABLE IF NOT EXISTS revenue (
//       month VARCHAR(4) NOT NULL UNIQUE,
//       revenue INT NOT NULL
//     );
//   `

//   const insertedRevenue = await Promise.all(
//     revenue.map(
//       (rev) => client.sql`
//         INSERT INTO revenue (month, revenue)
//         VALUES (${rev.month}, ${rev.revenue})
//         ON CONFLICT (month) DO NOTHING;
//       `
//     )
//   )

//   return insertedRevenue
// }

export async function GET() {
  const user = await auth()

  if (!user || user?.user?.email !== process.env.ADMIN_EMAIL) {
    return Response.json({
      message:
        'Nice try, precautions have been taken to avoid this naughty behavior 🎅',
    })
  }

  try {
    const publicCustomersPath = './public/customers'

    // Delete all images from /public/customers folder
    const files = await fs.readdir(publicCustomersPath)
    await Promise.all(
      files.map((file) => fs.unlink(`${publicCustomersPath}/${file}`))
    )

    // Copy all images from /app/api/seed/customers to /public/customers
    await Promise.all(
      customers.map((customer) => {
        const imageName = customer.image_url.split('/').pop()
        return fs.copyFile(
          `./app/api/seed/customers/${imageName}`,
          `${publicCustomersPath}/${imageName}`
        )
      })
    )
  } catch (error) {
    return Response.json({ error }, { status: 500 })
  }

  try {
    await client.sql`BEGIN`
    await dropDatabase()
    await seedUsers()
    await seedCustomers()
    await seedInvoices()
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
