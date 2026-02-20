import { useState } from "react"
import { ArrowUpDown, Eye, EyeOff } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface SupportedModel {
  model_name: string
}

const API_BASE = import.meta.env.VITE_API_URL ?? ""

export function App() {
  const [apiKey, setApiKey] = useState("")
  const [savedKey, setSavedKey] = useState("")
  const [models, setModels] = useState<SupportedModel[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [showKey, setShowKey] = useState(false)

  const fetchModels = () => {
    setLoading(true)
    setError(null)
    fetch(`${API_BASE}/api/supported-models`, {
      headers: { "X-API-Key": savedKey },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch models")
        return res.json()
      })
      .then((data) => setModels(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  const sortedModels = [...models].sort((a, b) => {
    const cmp = a.model_name.localeCompare(b.model_name)
    return sortAsc ? cmp : -cmp
  })

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Tinker Studio</h1>

      <div className="mb-8 space-y-3">
        <label className="text-sm font-medium">API Key</label>
        <p className="text-sm text-muted-foreground">
          Your key is never stored or logged.
        </p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type={showKey ? "text" : "password"}
              placeholder="TINKER_API_KEY"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <button
            onClick={() => setSavedKey(apiKey)}
            disabled={!apiKey}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Save
          </button>
        </div>
        <button
          onClick={fetchModels}
          disabled={!savedKey || loading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Get Supported Models"}
        </button>
        {error && <p className="text-sm text-destructive">Error: {error}</p>}
      </div>

      {models.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-4">Supported Models</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer select-none hover:text-foreground"
                  onClick={() => setSortAsc(!sortAsc)}
                >
                  <span className="flex items-center gap-1">
                    Model Name
                    <ArrowUpDown className="h-4 w-4" />
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedModels.map((model) => (
                <TableRow key={model.model_name}>
                  <TableCell>{model.model_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  )
}

export default App
