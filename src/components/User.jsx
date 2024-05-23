/* eslint-disable react/prop-types */
const styleContent = { 
  marginRight: 10, 
  width: '30vw', 
  maxWidth: '500px',
  whiteSpace: 'nowrap', 
  overflow: 'hidden', 
  textOverflow: 'ellipsis' }

const User = ({ user }) => {
    return (
      <li style={{display:'flex',gap:10}}>
      <div style={styleContent} title={user.username}>{user.username}</div>
      <div style={styleContent} title={user.email}>{user.email}</div>
      </li>
    )
}

export default User;