import { ReactNode } from 'react'

// UI组件基础类型
export interface BaseComponentProps {
  className?: string
  children?: ReactNode
  id?: string
  'data-testid'?: string
}

// 按钮组件类型
export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

// 输入框组件类型
export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  disabled?: boolean
  required?: boolean
  min?: number
  max?: number
  step?: number
}

// 模态框组件类型
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
}

// 通知组件类型
export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'
  closable?: boolean
}

// 加载状态类型
export interface LoadingState {
  isLoading: boolean
  message?: string
  progress?: number
}

// 主题类型
export interface Theme {
  mode: 'light' | 'dark' | 'system'
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  borderColor: string
}

// 响应式断点类型
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface ResponsiveValue<T> {
  xs?: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
  '2xl'?: T
}

// 动画类型
export interface AnimationProps {
  initial?: any
  animate?: any
  exit?: any
  transition?: any
  variants?: any
}

// 布局类型
export interface LayoutProps extends BaseComponentProps {
  direction?: 'row' | 'column'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  gap?: number | string
  padding?: number | string
  margin?: number | string
}

// 网格布局类型
export interface GridProps extends BaseComponentProps {
  columns?: number | ResponsiveValue<number>
  gap?: number | string
  autoFit?: boolean
  autoFill?: boolean
}

// 表单类型
export interface FormProps extends BaseComponentProps {
  onSubmit?: (data: any) => void
  onReset?: () => void
  initialValues?: Record<string, any>
  validationSchema?: any
}

export interface FormFieldProps extends BaseComponentProps {
  name: string
  label?: string
  error?: string
  required?: boolean
  helperText?: string
}

// 导航类型
export interface NavigationItem {
  id: string
  label: string
  href?: string
  icon?: ReactNode
  children?: NavigationItem[]
  disabled?: boolean
  external?: boolean
}

export interface NavigationProps extends BaseComponentProps {
  items: NavigationItem[]
  activeItem?: string
  onItemClick?: (item: NavigationItem) => void
  orientation?: 'horizontal' | 'vertical'
}
