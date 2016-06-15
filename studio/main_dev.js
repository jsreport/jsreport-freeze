import Studio from 'jsreport-studio'

const freeze = () => {
  Studio.setSetting('freeze', true)
}

const release = () => {
  Studio.setSetting('freeze', false)
}

Studio.initializeListeners.push(() => {
  if (Studio.authentication && !Studio.authentication.user.isAdmin) {
    return
  }

  Studio.addToolbarComponent(() => Studio.getSettingValueByKey('freeze', false) ? <span /> : <div
    className={'toolbar-button'} onClick={freeze}>
    <i className='fa fa-lock' />Freeze edits</div>, 'settings')

  Studio.addToolbarComponent(() => Studio.getSettingValueByKey('freeze', false) ? <div
    className={'toolbar-button'} onClick={release}>
    <i className='fa fa-unlock' />Release freeze</div> : <span />, 'settings')
})
