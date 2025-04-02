import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const MENU_STYLE = {
  color: 'primary.main',
  bgcolor: 'white',
  border: 'none',
  paddingX: '5pxp',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'primary.main'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar() {
  return (
    <Box  sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingX: 2,
      gap: 2,
      overflowX: 'auto',
      borderTop: '1px solid #00bfa5',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
        <Chip 
          sx={MENU_STYLE}
          icon={<DashboardIcon />} 
          label="TienThangDev MERN STACK Board" 
          clickable     
        />
        <Chip 
          sx={MENU_STYLE}
          icon={<VpnLockIcon />} 
          label="Public/Private Workspace" 
          clickable     
        />
        <Chip 
          sx={MENU_STYLE}
          icon={<AddToDriveIcon />} 
          label="Add To Google Drive" 
          clickable     
        />
        <Chip 
          sx={MENU_STYLE}
          icon={<AddToDriveIcon />} 
          label="Add To Google Drive" 
          clickable     
        />
        <Chip 
          sx={MENU_STYLE}
          icon={<BoltIcon />} 
          label="Automation" 
          clickable     
        />
        <Chip 
          sx={MENU_STYLE}
          icon={<FilterListIcon />} 
          label="Filters" 
          clickable     
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
        <Button variant="outlined" startIcon={<PersonAddIcon/>}>Invite</Button>
        <AvatarGroup 
          max={4}
          sx={{ 
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
            }
          }}
        >
          <Tooltip title="TienThangdev">
            <Avatar 
              alt="TienThangdev" 
              src="/static/images/avatar/1.jpg" 
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
