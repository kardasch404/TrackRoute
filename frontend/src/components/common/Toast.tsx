interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
}

export default function Toast({ message, type = 'info' }: ToastProps) {
  const types = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div className={`${types[type]} text-white px-6 py-3 rounded-lg shadow-lg`}>
      {message}
    </div>
  );
}
