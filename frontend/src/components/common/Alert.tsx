interface AlertProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info';
}

export default function Alert({ children, variant = 'info' }: AlertProps) {
  const variants = {
    success: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    danger: 'bg-red-100 text-red-800 border-red-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  return <div className={`p-4 rounded-md border ${variants[variant]}`}>{children}</div>;
}
