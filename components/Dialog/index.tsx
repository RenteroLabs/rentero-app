import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import React, { ReactNode, useEffect, useState } from 'react'

import CloseIcon from '@mui/icons-material/Close';
import styles from './index.module.scss'

export interface AppDialogProps {
  trigger: React.ReactNode;
  title: string;
  hiddenDialog?: boolean;
  children?: React.ReactNode
}

const AppDialog: React.FC<AppDialogProps> = (props) => {
  const [visibile, setVisibile] = useState<boolean>(false)
  const { children, title, trigger, hiddenDialog } = props

  useEffect(() => {
    if (hiddenDialog) {
      setVisibile(false)
    }
  }, [hiddenDialog])

  return <React.Fragment>
    <div onClick={() => { setVisibile(true) }}>
      {trigger}
    </div>
    <Dialog open={visibile} className={styles.container} >
      <DialogTitle className={styles.dialogTitle}>
        {title}
        <IconButton
          aria-label="close"
          onClick={() => setVisibile(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: "2rem",
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {children}
    </Dialog>
  </React.Fragment >


}

export default AppDialog