import './header.css'

function Header() {
  return (
    <div className='header-container'>
      <div className='header-content'>
        <div className='overall-title'>
          <span className="status-dot status-dot-success"></span>
          Everything look good.
        </div>
        <div className='nubmer-clients'>
          20 clients
        </div>
      </div>
    </div>
  )
}

export default Header
