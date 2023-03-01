import { observable } from './@formily/reactive'
import { Observer } from './@formily/reactive-react'
const username = observable({ value: '狂飙' })
const age = observable({ value: 100 })
function App() {

  return (
    <>
      <Observer>
        {
          () => (<input value={username.value} onChange={event => username.value = event.target.value} />)
        }
      </Observer>
      <Observer>
        {
          () => {
            console.log('username render')
            return <div>{username.value}</div>
          }
        }
      </Observer>
      <Observer>
        {
          () => (<input value={age.value} onChange={event => age.value = +event.target.value} />)
        }
      </Observer>
      <Observer>
        {
          () => {
            console.log('age render')
            return <div>{age.value}</div>
          }
        }
      </Observer>
    </>
  )
}
export default App;