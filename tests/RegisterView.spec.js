import { render, fireEvent, screen, cleanup } from '@testing-library/vue'
import RegisterView from '@/views/RegisterView.vue'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { useAuthStore } from '@/stores/auth'
import '@testing-library/jest-dom'

vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn()
}))

afterEach(() => {
  cleanup()
})

describe('RegisterView', () => {
  it('displays validation errors for empty fields (mocked backend)', async () => {
    const validationError = {
      errors: {
        name: ['Name is required'],
        email: ['Email is required'],
        password: ['Password is required'],
        password_confirmation: ['Confirm Password is required'],
      }
    }

    useAuthStore.mockReturnValue({
      register: vi.fn(() => Promise.reject(validationError))
    })

    render(RegisterView) // no createTestingPinia

    const form = screen.getByTestId('register-form')
    await fireEvent.submit(form)

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/confirm password is required/i)).toBeInTheDocument()
  })
})
