import StyleForm from './components/StyleForm'
import SmartDraft from './components/SmartDraft'
import Thoughts from './components/Thoughts'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-10">
      <h1 className="text-3xl font-bold">EchoTwin · Your AI, In Sync</h1>

      <StyleForm />
      <hr className="my-10" />
      <SmartDraft />
      <hr className="my-10" />
      <Thoughts />
    </div>
  )
}
