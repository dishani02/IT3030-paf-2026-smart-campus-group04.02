import { useState } from 'react'
import api from '../services/api'

export default function EmailValidator({ onEmailValid, onEmailInvalid }) {
    const [email, setEmail] = useState('')
    const [validating, setValidating] = useState(false)
    const [validationResult, setValidationResult] = useState(null)

    const validateEmail = async (e) => {
        e.preventDefault()
        if (!email.trim()) return

        setValidating(true)
        setValidationResult(null)

        try {
            const response = await api.post('/auth/validate-email', { email })
            const result = response.data
            
            setValidationResult({
                allowed: result.allowed,
                role: result.role,
                roleDescription: result.roleDescription,
                message: result.message
            })

            if (result.allowed) {
                onEmailValid(email, result.role, result.roleDescription)
            } else {
                onEmailInvalid(email, result.message)
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Email validation failed'
            setValidationResult({
                allowed: false,
                message
            })
            onEmailInvalid(email, message)
        } finally {
            setValidating(false)
        }
    }

    const getEmailPatternInfo = () => {
        return [
            { pattern: 'it########@my.sliit.lk', role: 'Student', description: 'Students: it followed by 8 digits' },
            { pattern: '@sliit.lk', role: 'Staff', description: 'Staff members' },
            { pattern: '@admincampus.edu', role: 'Admin', description: 'Administrators' },
            { pattern: '@techcampus.edu', role: 'Technician', description: 'Technical staff' },
            { pattern: '@opscampus.edu', role: 'Operations', description: 'Operations staff' }
        ]
    }

    return (
        <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            padding: 20,
            marginBottom: 24
        }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>
                🎓 Institutional Email Validation
            </div>
            
            <form onSubmit={validateEmail} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <input
                        type="email"
                        placeholder="Enter your institutional email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '10px 14px',
                            border: '1px solid #d1d5db',
                            borderRadius: 8,
                            fontSize: 14,
                            outline: 'none'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={validating || !email.trim()}
                        style={{
                            padding: '10px 20px',
                            background: validating ? '#94a3b8' : '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: 8,
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: validating ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s'
                        }}
                    >
                        {validating ? 'Validating...' : 'Validate'}
                    </button>
                </div>
            </form>

            {validationResult && (
                <div style={{
                    padding: '12px 14px',
                    borderRadius: 8,
                    background: validationResult.allowed ? '#dcfce7' : '#fef2f2',
                    border: `1px solid ${validationResult.allowed ? '#bbf7d0' : '#fecaca'}`,
                    marginBottom: 12
                }}>
                    <div style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: validationResult.allowed ? '#166534' : '#dc2626',
                        marginBottom: 4
                    }}>
                        {validationResult.allowed ? '✅ Email Valid' : '❌ Access Denied'}
                    </div>
                    <div style={{
                        fontSize: 12,
                        color: validationResult.allowed ? '#15803d' : '#991b1b',
                        lineHeight: 1.4
                    }}>
                        {validationResult.message}
                    </div>
                    {validationResult.allowed && validationResult.role && (
                        <div style={{
                            marginTop: 8,
                            padding: '6px 10px',
                            background: validationResult.allowed ? '#f0fdf4' : '#fef2f2',
                            borderRadius: 6,
                            fontSize: 11,
                            color: validationResult.allowed ? '#166534' : '#991b1b'
                        }}>
                            Assigned Role: <strong>{validationResult.roleDescription}</strong> ({validationResult.role})
                        </div>
                    )}
                </div>
            )}

            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                Only institutional email addresses are allowed for Google OAuth sign-in:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {getEmailPatternInfo().map((info, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 12px',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: 6
                    }}>
                        <div style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: '2px 6px',
                            background: '#f1f5f9',
                            borderRadius: 4,
                            color: '#475569'
                        }}>
                            {info.role}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>
                            {info.pattern}
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>
                            {info.description}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
