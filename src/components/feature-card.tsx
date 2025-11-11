import { Card, CardContent } from '@/components/ui/card'

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
}

export default function FeatureCard ({ title, description, icon }: FeatureCardProps): React.ReactNode {
  return (
    <Card className='hover:shadow-lg transition-shadow'>
      <CardContent className='flex flex-col items-center text-center p-6'>
        <div className='w-16 h-16 flex items-center justify-center rounded-full bg-bermuda-100 text-bermuda-600 mb-4'>
          {icon}
        </div>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>{title}</h3>
        <p className='text-gray-600'>{description}</p>
      </CardContent>
    </Card>
  )
}
