import './Board.css'

const Board = ({userList}) => {
  return (
    <div>
      Online users: {userList.map(val => val.userName).join(',')}
    </div>
  )
}

export default Board
