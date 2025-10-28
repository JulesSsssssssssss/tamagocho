import { Card, CardContent } from '@/components/ui/card'

interface MonsterCardProps {
  name: string
  description: string
  image: string
}

export default function MonsterCard ({ name, description, image }: MonsterCardProps): React.ReactNode {
  return (
    <Card className='overflow-hidden hover:shadow-lg transition-shadow'>
      {/* Image du monstre */}
      <div className='relative h-48'>
        <img
          src={image}
          alt={`${name} - monstre virtuel Tamagocho`}
          className='w-full h-full object-cover'
        />
      </div>

      {/* Informations du monstre */}
      <CardContent className='p-4'>
        <h3 className='text-lg font-semibold text-gray-900'>{name}</h3>
        <p className='mt-2 text-sm text-gray-600'>{description}</p>
      </CardContent>
    </Card>
  )
}
