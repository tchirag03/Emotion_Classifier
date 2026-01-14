import React from 'react'

function App() {
  const [image, setImage] = React.useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [prediction, setPrediction] = React.useState<string>('')
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setImage(file)
    setError(null)
    setPrediction('')

    // preview
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }

  const upload = async () => {
    if (!image) {
      setError('No image selected')
      return
    }

    setError(null)
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', image)

      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `HTTP ${res.status}`)
      }

      // backend returns JSON like { "label": "happy" }
      const data = await res.json()
      setPrediction(data.label ?? JSON.stringify(data))
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl p-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Emotion Detector
          </h1>
          <p className="text-sm text-slate-400">
            Upload a face image and get the predicted emotion.
          </p>
        </header>

        <div className="space-y-3">
          <label
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer bg-slate-900/60 hover:border-slate-500 hover:bg-slate-900 transition"
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <span className="text-sm text-slate-300">
              Click to choose an image
            </span>
            <span className="text-xs text-slate-500 mt-1">
              PNG / JPG / JPEG
            </span>
          </label>

          {image && (
            <p className="text-xs text-slate-400 truncate">
              Selected: <span className="font-medium">{image.name}</span>
            </p>
          )}

          {previewUrl && (
            <div className="mt-2 flex justify-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-xl border border-slate-700"
              />
            </div>
          )}

          <button
            onClick={upload}
            disabled={!image || loading}
            className={`w-full mt-3 py-2.5 rounded-xl text-sm font-medium transition
              ${!image || loading
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-500 hover:bg-indigo-400 text-white'}
            `}
          >
            {loading ? 'Predicting…' : 'Upload & Predict'}
          </button>
        </div>

        <div className="pt-3 border-t border-slate-800 space-y-1">
          <h2 className="text-sm font-semibold text-slate-200">Prediction</h2>
          {error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : (
            <p className="text-lg font-medium text-indigo-300 min-h-[1.5rem]">
              {prediction || 'No prediction yet.'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
