import { Box } from '@mui/material';
import CycloneIcon from '@mui/icons-material/Cyclone';

/**
 * Componente de loading com animação personalizada
 * Exibe indicador de carregamento em tela cheia com animação do ícone
 * @param props - Propriedades do componente
 * @param props.show - Controla a visibilidade do loading
 * @returns JSX do componente de loading animado
 */
export const AppLoading = ({ show }: { show: boolean }) => {
  return (
    <Box
      sx={({ palette }) => ({
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        placeContent: 'center',
        placeItems: 'center',
        zIndex: 99999,
        opacity: show ? 1 : 0,
        pointerEvents: show ? 'auto' : 'none',
        transition: 'opacity 250ms ease-in-out',
        backgroundColor: palette.primary.dark,
      })}
    >
      <Box
        sx={{
          position: 'relative',
          width: '150px',
          height: '150px',
          '@keyframes loadingIcon': {
            '0%': {
              opacity: 0.2,
            },
            '50%': {
              opacity: 1,
              transform: 'rotate(180deg)',
            },
            '100%': {
              opacity: 0.2,
              transform: 'rotate(0)',
            },
          },
          animation: '3s cubic-bezier(.45,0,.6,1) loadingIcon infinite',
          svg: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          },
        }}
      >
        <CycloneIcon />
      </Box>
    </Box>
  );
};
