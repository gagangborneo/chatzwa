'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Printer,
  Share2,
} from 'lucide-react'

interface InvoiceData {
  id: string
  number: string
  status: 'paid' | 'pending' | 'failed' | 'cancelled'
  amount: number
  currency: string
  date: string
  dueDate: string
  description: string
  type: 'subscription' | 'topup' | 'refund'
  subscriptionPlan?: string
  billingPeriod?: string
  paymentMethod: string
  transactionId: string
  customerInfo: {
    name: string
    email: string
    phone: string
    company?: string
    address: string
    city: string
    country: string
  }
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  subtotal: number
  tax: number
  total: number
  paidAt?: string
  createdAt: string
  updatedAt: string
}

export default function InvoicePage() {
  const router = useRouter()
  const params = useParams()
  const { t } = useI18n()
  const invoiceId = params.id as string

  const [invoice, setInvoice] = useState<InvoiceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Sample invoice data based on transaction ID
  const getSampleInvoiceData = (id: string): InvoiceData => {
    const baseData = {
      id: id,
      number: `INV-${Date.now()}`,
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      billingPeriod: 'Oktober 2024',
      paymentMethod: 'Credit Card (****1234)',
      transactionId: id,
      customerInfo: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+62 812 3456 7890',
        company: 'PT Example Company',
        address: 'Jl. Example No. 123',
        city: 'Jakarta',
        country: 'Indonesia'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    switch (id) {
      case 'txn_001':
        return {
          ...baseData,
          status: 'paid',
          amount: 1200000,
          currency: 'IDR',
          description: 'Buat langganan Pro Plan',
          type: 'subscription',
          subscriptionPlan: 'Pro Plan (Bulanan)',
          paidAt: '2024-10-15T10:30:00Z',
          items: [
            {
              description: 'Pro Plan - Bulanan',
              quantity: 1,
              unitPrice: 1200000,
              total: 1200000
            }
          ],
          subtotal: 1200000,
          tax: 0,
          total: 1200000
        }
      case 'txn_002':
        return {
          ...baseData,
          status: 'paid',
          amount: 750000,
          currency: 'IDR',
          description: 'Top up saldo',
          type: 'topup',
          paidAt: '2024-10-10T14:20:00Z',
          items: [
            {
              description: 'Top Up Saldo',
              quantity: 1,
              unitPrice: 750000,
              total: 750000
            }
          ],
          subtotal: 750000,
          tax: 0,
          total: 750000
        }
      case 'txn_003':
        return {
          ...baseData,
          status: 'pending',
          amount: 450000,
          currency: 'IDR',
          description: 'Perpanjang langganan Starter Plan',
          type: 'subscription',
          subscriptionPlan: 'Starter Plan (Bulanan)',
          items: [
            {
              description: 'Starter Plan - Bulanan',
              quantity: 1,
              unitPrice: 450000,
              total: 450000
            }
          ],
          subtotal: 450000,
          tax: 0,
          total: 450000
        }
      case 'txn_004':
        return {
          ...baseData,
          status: 'paid',
          amount: 3000000,
          currency: 'IDR',
          description: 'Upgrade ke Enterprise Plan',
          type: 'subscription',
          subscriptionPlan: 'Enterprise Plan (Tahunan)',
          paidAt: '2024-09-01T08:00:00Z',
          items: [
            {
              description: 'Enterprise Plan - Tahunan',
              quantity: 1,
              unitPrice: 3000000,
              total: 3000000
            }
          ],
          subtotal: 3000000,
          tax: 0,
          total: 3000000
        }
      case 'txn_005':
        return {
          ...baseData,
          status: 'paid',
          amount: 450000,
          currency: 'IDR',
          description: 'Refund pembatalan langganan',
          type: 'refund',
          paidAt: '2024-08-25T15:45:00Z',
          items: [
            {
              description: 'Refund - Pembatalan Langganan',
              quantity: 1,
              unitPrice: -450000,
              total: -450000
            }
          ],
          subtotal: -450000,
          tax: 0,
          total: -450000
        }
      default:
        return {
          ...baseData,
          status: 'pending',
          amount: 0,
          currency: 'USD',
          description: 'Transaksi tidak ditemukan',
          type: 'subscription',
          items: [],
          subtotal: 0,
          tax: 0,
          total: 0
        }
    }
  }

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true)
        setError(null)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))

        // Set sample data
        const invoiceData = getSampleInvoiceData(invoiceId)
        setInvoice(invoiceData)

      } catch (error) {
        console.error('Error fetching invoice:', error)
        setError('Gagal memuat invoice')
      } finally {
        setLoading(false)
      }
    }

    if (invoiceId) {
      fetchInvoice()
    }
  }, [invoiceId])

  const handleDownload = () => {
    // Simulate download
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${invoice?.number}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
              .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
              .customer-info, .company-info { width: 48%; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #f5f5f5; }
              .total { font-weight: bold; font-size: 18px; }
              .status { padding: 10px; border-radius: 4px; text-align: center; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Invoice ${invoice?.number}</h1>
              <p>Status: ${invoice?.status}</p>
            </div>
            <div class="invoice-details">
              <div class="customer-info">
                <h3>Customer Information</h3>
                <p><strong>${invoice?.customerInfo.name}</strong></p>
                <p>${invoice?.customerInfo.email}</p>
                <p>${invoice?.customerInfo.phone}</p>
                ${invoice?.customerInfo.company ? `<p>${invoice.customerInfo.company}</p>` : ''}
                <p>${invoice?.customerInfo.address}</p>
                <p>${invoice?.customerInfo.city}, ${invoice?.customerInfo.country}</p>
              </div>
              <div class="company-info">
                <h3>Company Information</h3>
                <p><strong>Chatbot AI Platform</strong></p>
                <p>support@chatbot.ai</p>
                <p>+62 21 1234 5678</p>
                <p>Jakarta, Indonesia</p>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoice?.items.map(item => `
                  <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.unitPrice}</td>
                    <td>$${item.total}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div style="text-align: right;">
              <p>Subtotal: $${invoice?.subtotal}</p>
              <p>Tax: $${invoice?.tax}</p>
              <p class="total">Total: $${invoice?.total}</p>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleShare = () => {
    // Simulate share functionality
    if (navigator.share) {
      navigator.share({
        title: `Invoice ${invoice?.number}`,
        text: `Invoice ${invoice?.number} - ${invoice?.description}`,
        url: window.location.href
      })
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link invoice disalin ke clipboard!')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'failed': return <XCircle className="h-4 w-4" />
      case 'cancelled': return <AlertCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string, type?: string) => {
    if (type === 'refund') {
      return status === 'paid' ? 'Direfund' :
             status === 'pending' ? 'Menunggu Refund' :
             status === 'failed' ? 'Refund Gagal' : 'Dibatalkan'
    }
    return status === 'paid' ? 'Dibayar' :
           status === 'pending' ? 'Menunggu Pembayaran' :
           status === 'failed' ? 'Gagal' : 'Dibatalkan'
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('dashboard.back', 'Kembali')}
          </Button>
        </div>
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t('dashboard.invoiceNotFound', 'Invoice Tidak Ditemukan')}
          </h2>
          <p className="text-gray-600">{error || 'Invoice tidak ditemukan'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('dashboard.back', 'Kembali')}
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('dashboard.invoiceTitle', 'Invoice')}
              </h1>
              <p className="text-gray-600">#{invoice.number}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {t('dashboard.download', 'Unduh')}
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            {t('dashboard.share', 'Bagikan')}
          </Button>
        </div>
      </div>

      {/* Invoice Content */}
      <Card className="mb-6">
        <CardContent className="p-8">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice</h2>
              <p className="text-gray-600">#{invoice.number}</p>
              <div className="flex items-center gap-2 mt-3">
                <Badge className={getStatusColor(invoice.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(invoice.status)}
                    <span className="capitalize">
                      {getStatusText(invoice.status, invoice.type)}
                    </span>
                  </div>
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{t('dashboard.invoiceDate', 'Tanggal Invoice')}</p>
              <p className="font-semibold">
                {new Date(invoice.date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              <p className="text-sm text-gray-600 mt-2">{t('dashboard.dueDate', 'Jatuh Tempo')}</p>
              <p className="font-semibold">
                {new Date(invoice.dueDate).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Customer & Company Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                {t('dashboard.billTo', 'Ditagihankan kepada')}
              </h3>
              <div className="space-y-2">
                <p className="font-medium">{invoice.customerInfo.name}</p>
                <p className="text-sm text-gray-600">{invoice.customerInfo.email}</p>
                <p className="text-sm text-gray-600">{invoice.customerInfo.phone}</p>
                {invoice.customerInfo.company && (
                  <p className="text-sm text-gray-600">{invoice.customerInfo.company}</p>
                )}
                <p className="text-sm text-gray-600">{invoice.customerInfo.address}</p>
                <p className="text-sm text-gray-600">
                  {invoice.customerInfo.city}, {invoice.customerInfo.country}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                {t('dashboard.companyInfo', 'Informasi Perusahaan')}
              </h3>
              <div className="space-y-2">
                <p className="font-medium">Chatbot AI Platform Chatzwa</p>
                <p className="text-sm text-gray-600">support@chatbot.ai</p>
                <p className="text-sm text-gray-600">+62 21 1234 5678</p>
                <p className="text-sm text-gray-600">Jakarta, Indonesia</p>
              </div>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    {t('dashboard.description', 'Deskripsi')}
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">
                    {t('dashboard.quantity', 'Kuantitas')}
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    {t('dashboard.unitPrice', 'Harga Satuan')}
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    {t('dashboard.total', 'Total')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4">{item.description}</td>
                    <td className="py-3 px-4 text-center">{item.quantity}</td>
                    <td className="py-3 px-4 text-right">
                      ${item.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      ${item.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('dashboard.subtotal', 'Subtotal')}</span>
                <span className={invoice.type === 'refund' ? 'text-red-600' : ''}>
                  ${invoice.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('dashboard.tax', 'Pajak')}</span>
                <span className={invoice.type === 'refund' ? 'text-red-600' : ''}>
                  ${invoice.tax.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>{t('dashboard.totalAmount', 'Total Jumlah')}</span>
                <span className={invoice.type === 'refund' ? 'text-red-600' : 'text-green-600'}>
                  ${invoice.total.toLocaleString()} {invoice.currency}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-semibold text-gray-900 mb-4">
              {t('dashboard.paymentDetails', 'Detail Pembayaran')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">{t('dashboard.paymentMethod', 'Metode Pembayaran')}</p>
                <p className="font-medium">{invoice.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('dashboard.transactionId', 'ID Transaksi')}</p>
                <p className="font-medium">{invoice.transactionId}</p>
              </div>
              {invoice.paidAt && (
                <div>
                  <p className="text-sm text-gray-600">{t('dashboard.paidAt', 'Dibayar pada')}</p>
                  <p className="font-medium">
                    {new Date(invoice.paidAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')}
        >
          {t('dashboard.backToDashboard', 'Kembali ke Dashboard')}
        </Button>
        <Button
          onClick={handleDownload}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Download className="mr-2 h-4 w-4" />
          {t('dashboard.downloadInvoice', 'Unduh Invoice')}
        </Button>
      </div>
    </div>
  )
}