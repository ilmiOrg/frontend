import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Button from './Button'
import Input from '../Input/Input'
import Card from '../Card/index'
import Badge from '../Badge/index'

describe('UI Components', () => {
  test('Button renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  test('Button renders with different variants', () => {
    render(<Button variant="secondary">Secondary Button</Button>)
    expect(screen.getByText('Secondary Button')).toBeInTheDocument()
  })

  test('Input renders with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  test('Card renders children', () => {
    render(
      <Card>
        <div>Card content</div>
      </Card>
    )
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  test('Badge renders with text', () => {
    render(<Badge>Success</Badge>)
    expect(screen.getByText('Success')).toBeInTheDocument()
  })
})