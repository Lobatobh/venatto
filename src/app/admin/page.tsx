import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_SESSION_COOKIE, validateSessionToken } from '@/lib/admin-session'

export default async function AdminPage() {
  const cookiesStore = await cookies()
  const cookieValue = cookiesStore.get(ADMIN_SESSION_COOKIE)?.value
  const email = cookieValue ? validateSessionToken(cookieValue) : null

  if (!email) {
    redirect('/admin/login')
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Painel Admin Venatto</h1>
        <p className="text-slate-700 mb-6">Login realizado com sucesso.</p>
        <div className="space-y-4">
          <p className="text-slate-600">Usuário autenticado como:</p>
          <p className="font-medium text-slate-900">{email}</p>
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href="/admin/home" className="inline-flex justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
            Editar Página Inicial
          </Link>
          <Link href="/api/admin/logout" className="inline-flex justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            Sair
          </Link>
          <Link href="/" className="inline-flex justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">
            Voltar ao site
          </Link>
        </div>
      </div>
    </main>
  )
}
