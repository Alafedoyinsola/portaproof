
import { useEffect, useState } from 'react'
import './App.css'

type Milestone = {
  id: number
  title: string
  description: string
  status: 'Completed' | 'In progress' | 'Planned'
}

function App() {
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
  const saved = localStorage.getItem('portaproof-milestones')

  if (saved) {
    return JSON.parse(saved) as Milestone[]
  }

  return [
    {
      id: 1,
      title: 'Project setup',
      description: 'Prepare the development environment',
      status: 'Completed',
    },
    {
      id: 2,
      title: 'Build the dashboard',
      description: 'Create the PortaProof user interface',
      status: 'In progress',
    },
    {
      id: 3,
      title: 'Portaldot integration',
      description: 'Connect and verify the V3 testnet',
      status: 'Planned',
    },
    ]
})


  useEffect(() => {
    localStorage.setItem('portaproof-milestones', JSON.stringify(milestones))
  }, [milestones])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  function addMilestone(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title.trim()) return

    setMilestones((current) => [
      ...current,
      {
        id: Date.now(),
        title: title.trim(),
        description: description.trim() || 'No description added',
        status: 'Planned',
      },
    ])

    setTitle('')
    setDescription('')
  }


  function updateMilestoneStatus(
    id: number,
    status: Milestone['status'],
  ) {
    setMilestones((current) =>
      current.map((milestone) =>
        milestone.id === id ? { ...milestone, status } : milestone,
      ),
    )
  }
  function deleteMilestone(id: number) {
    setMilestones((current) =>
      current.filter((milestone) => milestone.id !== id),
    )
  }

  const completed = milestones.filter(
    (milestone) => milestone.status === 'Completed',
  ).length

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-mark">P</span>
          PortaProof
        </a>
        <span className="network-badge">
          <span className="status-dot" />
          Portaldot V3 Testnet
        </span>
      </header>

      <section className="hero">
        <p className="eyebrow">BUILD · RECORD · PROVE</p>
        <h1>Your progress deserves proof.</h1>
        <p className="hero-copy">
          Track your build milestones in one place. Prepare your project
          for transparent, verifiable progress on Portaldot.
        </p>
        <div className="hero-stats">
          <div className="stat-card">
            <span>Total milestones</span>
            <strong>{milestones.length}</strong>
          </div>
          <div className="stat-card">
            <span>Completed</span>
            <strong>{completed}</strong>
          </div>
          <div className="stat-card">
            <span>Completion</span>
            <strong>
              {milestones.length
                ? Math.round((completed / milestones.length) * 100)
                : 0}
              %
            </strong>
          </div>
        </div>
      </section>

      <section className="workspace">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR WORKSPACE</p>
            <h2>Project milestones</h2>
          </div>
          <span className="count-badge">{milestones.length} total</span>
        </div>

        <div className="milestone-list">
          {milestones.map((milestone) => (
            <article className="milestone-card" key={milestone.id}>
              <div className="milestone-icon">
                {milestone.status === 'Completed' ? '✓' : '↗'}
              </div>
              <div className="milestone-content">
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
              </div>
              <span
                className={`status status-${milestone.status
                  .toLowerCase()
                  .replace(' ', '-')}`}
              >
                {milestone.status}
              </span>
<select
  value={milestone.status}
  onChange={(event) =>
    updateMilestoneStatus(
      milestone.id,
      event.target.value as Milestone['status'],
    )
  }
  aria-label={`Update status for ${milestone.title}`}
>
  <option value="Planned">Planned</option>
  <option value="In progress">In progress</option>
  <option value="Completed">Completed</option>
</select><button
  type="button"
  className="delete-button"
  onClick={() => deleteMilestone(milestone.id)}
>
  Delete
</button>

            </article>
          ))}
        </div>

        <form className="add-form" onSubmit={addMilestone}>
          <h2>Add a milestone</h2>
          <p>Record the next step in your project journey.</p>

          <label htmlFor="milestone-title">Milestone title</label>
          <input
            id="milestone-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. First test passed"
            required
          />

          <label htmlFor="milestone-description">Description</label>
          <input
            id="milestone-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What did you accomplish?"
          />

          <button type="submit">+ Add milestone</button>
        </form>
      </section>

      <footer>
        <span>PortaProof</span>
        <span>Hackathon prototype · On-chain integration coming next</span>
      </footer>
    </main>
  )
}

export default App
