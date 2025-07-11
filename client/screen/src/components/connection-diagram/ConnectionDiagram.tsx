import './connection-diagram.css'
import globalIcon from '../../assets/global.svg'
import routerIcon from '../../assets/router.png'
import plugIcon from '../../assets/plug.svg'

function ConnectionDiagram() {
  return (
    <div className='connection-diagram-container'>
        <div className="global">
            <img src={globalIcon} alt="Global" />
        </div>
        <div className='list-devices'>
            <div className='internet-connect-line'></div>
            <div className="diagram-item router">
                <img src={routerIcon} alt="Router" />
                <span className='device-name'>Trên đầu BOD</span>
                <div className='connect-line'></div>
            </div>
            <div>
                <img src={plugIcon} width={14} height={14} alt="Ethernet" />
            </div>
            <div className="diagram-item router">
                <img src={routerIcon} alt="Router" />
                <span className='device-name'>Trên đầu web5</span>
                <div className='connect-line'></div>
            </div>
            <div>
                <img src={plugIcon} width={14} height={14} alt="Ethernet" />
            </div>
            <div className="diagram-item router">
                <img src={routerIcon} alt="Router" />
                <span className='device-name'>Trong phòng họp</span>
            </div>
        </div>
    </div>
  )
}

export default ConnectionDiagram
