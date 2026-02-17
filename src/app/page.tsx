import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">
            Vairavimo Rezervacijos
          </div>
          <div className="flex gap-4">
            <Link
              href="/prisijungimas"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Prisijungti
            </Link>
            <Link
              href="/registracija"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
            >
              Registruotis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Rezervacijų sistema
          <br />
          <span className="text-blue-600">vairavimo instruktoriams</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Profesionali platforma, leidžianti klientams lengvai rezervuoti
          vairavimo pamokas. Valdykite savo tvarkaraštį ir rezervacijas vienoje
          vietoje.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/registracija"
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg transition shadow-lg hover:shadow-xl"
          >
            Pradėti nemokamai
          </Link>
          <Link
            href="#features"
            className="px-8 py-4 bg-white text-gray-700 rounded-lg hover:bg-gray-50 font-semibold text-lg transition border-2 border-gray-200"
          >
            Sužinoti daugiau
          </Link>
        </div>
        <p className="mt-6 text-gray-500">
          🎉 7 dienų nemokamas bandomasis laikotarpis • Po to tik 5€/mėn
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Kodėl pasirinkti mūsų platformą?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border-2 border-gray-100 hover:border-blue-200 transition">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">
                Unikalus rezervacijų puslapis
              </h3>
              <p className="text-gray-600">
                Gaukite savo asmeninį linką, kurį galite dalintis su klientais.
                Jie matys laisvus laikus ir galės rezervuoti patys.
              </p>
            </div>

            <div className="p-6 rounded-xl border-2 border-gray-100 hover:border-blue-200 transition">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold mb-2">
                Lankstus darbo laiko valdymas
              </h3>
              <p className="text-gray-600">
                Nustatykite darbo valandas, pertraukas ir blokuokite laikus
                atostogoms. Viskas jūsų kontrolėje.
              </p>
            </div>

            <div className="p-6 rounded-xl border-2 border-gray-100 hover:border-blue-200 transition">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-xl font-semibold mb-2">
                Automatiniai pranešimai
              </h3>
              <p className="text-gray-600">
                Gaukite el. laiškus apie naujas rezervacijas. Klientai gauna
                patvirtinimus automatiškai.
              </p>
            </div>

            <div className="p-6 rounded-xl border-2 border-gray-100 hover:border-blue-200 transition">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">
                Aiškus dashboard
              </h3>
              <p className="text-gray-600">
                Matykite visas rezervacijas kalendoriaus vaizde. Tvarkykite,
                patvirtinkite ar atšaukite rezervacijas.
              </p>
            </div>

            <div className="p-6 rounded-xl border-2 border-gray-100 hover:border-blue-200 transition">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Paprasta kaina</h3>
              <p className="text-gray-600">
                Tik 5€ per mėnesį. Jokių paslėptų mokesčių. 7 dienų nemokamas
                bandomasis laikotarpis.
              </p>
            </div>

            <div className="p-6 rounded-xl border-2 border-gray-100 hover:border-blue-200 transition">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">
                Veikia visur
              </h3>
              <p className="text-gray-600">
                Optimizuota mobiliesiems įrenginiams. Valdykite rezervacijas iš
                bet kur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pradėkite šiandien
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Registracija užtrunka tik minutę. Išbandykite nemokamai 7 dienas.
          </p>
          <Link
            href="/registracija"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg transition shadow-lg hover:shadow-xl"
          >
            Registruotis dabar
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>© 2026 Vairavimo Rezervacijos. Visos teisės saugomos.</p>
        </div>
      </footer>
    </div>
  );
}
