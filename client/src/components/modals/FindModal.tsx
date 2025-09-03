import { alpha, Box, LinearProgress } from '@mui/material';
import { IAccountSearch, IBaseModalProps, IFindModalResult } from 'interfaces';
import BaseModal from './BaseModal';
import { AppInput } from '../Input';
import { useEffect, useRef, useState } from 'react';
import { AvatarCard } from '../cards';
import { AppLink } from '../AppLink';
import { debounce, isEmpty } from 'lodash';
import { useServices } from 'hooks';

export const FindModal = ({ onClose }: Pick<IBaseModalProps, 'onClose'>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [term, setTerm] = useState<string>('');
  const [results, setResults] = useState<IAccountSearch>();
  const { searchAccount } = useServices();
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setResults(undefined);
    setIsSearching(true);

    const delay = Math.round(Math.random() * 1000) + 500;

    const search = debounce(async () => {
      const data = await searchAccount(term);
      setIsSearching(false);
      setResults(data);
    }, delay);

    search();
  };

  useEffect(() => {
    inputRef.current?.querySelector('input')?.focus();
  }, []);

  useEffect(() => {
    if (term.length > 2) {
      handleSearch();
    }
  }, [term]);

  useEffect(() => {
    if (results) {
      console.log(results);
    }
  }, [results]);

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
        {isSearching && (
          <LinearProgress
            sx={{
              marginTop: '10px',
            }}
          />
        )}
        {!isEmpty(results?.accounts) && (
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
            {results?.accounts.map((item) => (
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
