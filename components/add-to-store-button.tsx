"use client"

import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { BiCartAdd } from 'react-icons/bi'
import useCart from '@/hooks/use-cart'
import { getProductById } from '@/actions/product.actions'


interface AddToStoreButtonProps {
    product: Awaited<ReturnType<typeof getProductById>>
}
function AddToStoreButton({ product } : AddToStoreButtonProps) {
  const cart = useCart()
  const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

  return (
    <Button
    className="bg-emerald-800 text-white font-semibold py-3 px-16 rounded-xl flex items-center gap-2"
    onClick={() => cart.addItem(product!)}
  >
    Add to Store <BiCartAdd className="text-2xl" />
  </Button>
  )
}

export default AddToStoreButton


