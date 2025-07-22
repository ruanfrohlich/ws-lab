import { alpha, Box } from '@mui/material';
import { IBaseModalProps, IFindModalResult } from '../../interfaces';
import BaseModal from './BaseModal';
import { AppInput } from '../Input';
import { useEffect, useRef, useState } from 'react';
import mockDB from '../../data/mockDB.json';
import { AvatarCard } from '../cards';
import { AppLink } from '../AppLink';
import { isEmpty } from 'lodash';
import { normalize } from '../../utils';

export const FindModal = ({ onClose }: Pick<IBaseModalProps, 'onClose'>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [term, setTerm] = useState<string>('');
  const [results, setResults] = useState<IFindModalResult[] | null>(null);

  const handleSearch = async () => {
    setResults(null);

    const fetch = () =>
      new Promise<IFindModalResult[] | null>((res) => {
        setTimeout(() => {
          const user = mockDB.filter((el) => normalize(el.name).includes(normalize(term))) ?? null;

          res(user);
        }, 2000);
      });

    const res = await fetch();

    setResults(res);
  };

  useEffect(() => {
    inputRef.current?.querySelector('input')?.focus();
  }, []);

  useEffect(() => {
    if (term.length > 2) {
      handleSearch();
    }
  }, [term]);

  return (
    <BaseModal canClose={false} closeFocus {...{ onClose }}>
      <Box
        sx={{
          minWidth: '400px',
        }}
      >
        <AppInput
          id='general-search'
          ref={inputRef}
          error=''
          label='Buscar servidor, usuário ou canal.'
          value={term}
          onChange={({ target: { value } }) => setTerm(value)}
          autoComplete='off'
        />
        {!isEmpty(results) && (
          <Box
            component={'ul'}
            sx={{
              listStyle: 'none',
              margin: '0',
              padding: '0',
              display: 'flex',
              paddingTop: '20px',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            {results?.map((item) => (
              <Box
                component={'li'}
                key={item.slug}
                sx={({ palette: { secondary } }) => ({
                  padding: '10px',
                  borderRadius: '20px',
                  transition: 'background 250ms ease-in-out',
                  ':hover': {
                    backgroundColor: alpha(secondary.main, 0.4),
                  },
                })}
              >
                <AppLink to={`${item.type}?slug=${item.slug}`} onClick={onClose}>
                  <AvatarCard data={item} />
                </AppLink>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </BaseModal>
  );
};
