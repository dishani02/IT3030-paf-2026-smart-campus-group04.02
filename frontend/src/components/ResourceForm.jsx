import { useState, useEffect } from 'react'
import { resourceService } from '../services/resourceService'

export default function ResourceForm({ resource = null, onSaved, onCancel }) {
  const [name, setName] = useState(resource?.name || '')
  const [type, setType] = useState(resource?.type || 'ROOM')
  const [capacity, setCapacity] = useState(resource?.capacity || '')
  const [location, setLocation] = useState(resource?.location || '')
  const [availabilityStart, setAvailabilityStart] = useState(resource?.availabilityStart || '')
  const [availabilityEnd, setAvailabilityEnd] = useState(resource?.availabilityEnd || '')
  const [status, setStatus] = useState(resource?.status || 'ACTIVE')
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => { setErrors({}) }, [name, capacity, availabilityStart, availabilityEnd])

  function validate() {
    const e = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!capacity || Number(capacity) <= 0) e.capacity = 'Capacity must be greater than 0'
    if (availabilityStart && availabilityEnd && availabilityEnd <= availabilityStart) e.availability = 'End must be after start'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const payload = { name: name.trim(), type, capacity: Number(capacity), location, availabilityStart, availabilityEnd, status }
      if (resource?.id) {
        await resourceService.update(resource.id, payload)
      } else {
        await resourceService.create(payload)
      }
      onSaved?.()
    } catch (err) {
      if (err.response?.status === 409) {
        setErrors({ form: 'Resource with same name and location already exists' })
      } else {
        setErrors({ form: err.response?.data?.message || 'Save failed' })
      }
    } finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit}>
      {errors.form && <div className="form-error">{errors.form}</div>}

      <div className="form-group">
        <label className="form-label required">Name</label>
        <input className={`form-control ${errors.name ? 'error' : ''}`} value={name} onChange={e => setName(e.target.value)} />
        {errors.name && <div className="form-error">{errors.name}</div>}
      </div>

      <div className="form-group">
        <label className="form-label required">Type</label>
        <select className="select-control" value={type} onChange={e => setType(e.target.value)}>
          <option value="ROOM">Room</option>
          <option value="LAB">Lab</option>
          <option value="EQUIPMENT">Equipment</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label required">Capacity</label>
        <input type="number" min="1" className={`form-control ${errors.capacity ? 'error' : ''}`} value={capacity} onChange={e => setCapacity(e.target.value)} />
        {errors.capacity && <div className="form-error">{errors.capacity}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Location</label>
        <input className="form-control" value={location} onChange={e => setLocation(e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Availability Start</label>
          <input type="time" className="form-control" value={availabilityStart} onChange={e => setAvailabilityStart(e.target.value)} />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Availability End</label>
          <input type="time" className="form-control" value={availabilityEnd} onChange={e => setAvailabilityEnd(e.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Status</label>
        <select className="select-control" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </form>
  )
}
