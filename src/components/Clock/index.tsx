'use client'

import { Quicksand } from 'next/font/google'
import { useEffect, useState } from 'react'

const quicksand = Quicksand({ subsets: ['latin'] })
const displayDay = (day: number) => {
  switch (day) {
    case 1:
      return 'Mon'
    case 2:
      return 'Tue'
    case 3:
      return 'Wed'
    case 4:
      return 'Thu'
    case 5:
      return 'Fri'
    case 6:
      return 'Sat'
    default:
      return 'Sun'
  }
}

export const Clock = () => {
  const [nowTime, setNowTime] = useState(new Date())

  useEffect(() => {
    setInterval(updateClock, 1000)
    updateClock()
  }, [])

  const updateClock = () => {
    setNowTime(new Date())
  }

  return (
    <div
      className={`${quicksand.className} text-white [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]`}
    >
      <div className="flex justify-center text-9xl">
        <div className="w-40 text-center">
          {nowTime.getHours().toString().padStart(2, '0')}
        </div>
        :
        <div className="w-40 text-center">
          {nowTime.getMinutes().toString().padStart(2, '0')}
        </div>
        :
        <div className="w-40 text-center">
          {nowTime.getSeconds().toString().padStart(2, '0')}
        </div>
      </div>
      <div className="flex flex-col items-center">
        {nowTime.getFullYear()}.
        {(nowTime.getMonth() + 1).toString().padStart(2, '0')}.
        {nowTime.getDate().toString().padStart(2, '0')}（
        {displayDay(nowTime.getDay())}）
      </div>
    </div>
  )
}
