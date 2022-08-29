import react from 'react'
import { Box, Card, Skeleton } from '@mui/material'
import styles from './index.module.scss'

const SkeletonNFTCard: React.FC = () => {
  return <Card className={styles.skeletonCard}>
    <Skeleton variant="rectangular" className={styles.nftImage} />
    <Box sx={{ display: 'flex', mt: '1.33rem' }}>
      <Skeleton variant="rectangular" className={styles.nftLogo} />
      <Skeleton variant="text" sx={{ display: 'inline-block', width: '12rem', height: '2.67rem', ml: '1rem' }} />
    </Box>
    <Skeleton variant="rectangular" width="19.5rem" height="2.5rem" sx={{ mt: '1rem' }} />
  </Card>
}

export default SkeletonNFTCard