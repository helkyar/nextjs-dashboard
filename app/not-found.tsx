import Link from 'next/link'

const t = {
  title: 'Page not found',
  description: "Sorry, we couldn't find the page you're looking for.",
  subtitle: '404',
  link: 'Go back home',
}

export default function NotFound() {
  return (
    <section className="pb-24 pt-40">
      <div className="sm:py-s4 min-h-full px-4 sm:px-6 md:grid md:place-items-center lg:px-8">
        <div className="mx-auto max-w-max">
          <main className="sm:flex">
            <p className="text-4x1 font-bold tracking-tight text-muted-foreground sm:text-5xl">
              {t.subtitle}
            </p>
            <div className="sm:ml-6">
              <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                <h1 className="sm:text- text-3xl font-bold tracking-tight sm:text-5xl"></h1>
                <p className="mt-1 text-base text-muted-foreground"></p>
              </div>
              <div className="mt-10 text-base text-muted-foreground">
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <p className="text-xl">↩</p>
                  <span>{t.link}</span>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  )
}
