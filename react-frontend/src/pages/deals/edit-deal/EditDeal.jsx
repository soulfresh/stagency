import React from 'react';

import { useTimeout } from '@thesoulfresh/react-tools';

import { getRoute } from '~/routes';
import { PageLoader, toast } from '~/components';
import { useGraphQLService } from '~/services';
import { debouncePromise } from '~/utils';
import { DealFlow } from '../deal-flow';

// import styles from './EditDeal.module.scss';

/**
 * Get the application config and the deal to edit.
 *
 * @param {object} props
 * @param {string} props.id - The id of the deal to retrieve.
 * @param {(config: object, deal: object) => React.ReactNode} props.children
 */
function WithDeps({
  id,
  children,
  ...rest
}) {
  const api = useGraphQLService();
  const [deal, setDeal] = React.useState();
  const [config, setConfig] = React.useState();
  const [, setError] = React.useState()

  React.useEffect(() => {
    Promise.all([
      api.getAppConfig(),
      api.getDeal(id)
    ]).then(([config, deal]) => {
      if (config) {
        setConfig(config)
      } else {
        // TODO Show a toast for all of these error conditions
        setError(new Error('Failed to retrieve application config.'));
      }

      if (deal) {
        setDeal(deal)
      } else {
        setError(new Error('Failed to create an empty deal.'));
      }
    }).catch((e) => {
      console.error(e);
      setError(new Error(`Failed to create new deal.`));
    })
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // TODO Show an error page if error is set.
  if (!config || !deal) return <PageLoader />
  else {
    return children({config, deal})
  }
}

// Memoize DealFlow so we don't perform any unnecessary work setting up the
// batch save functionality.
const DealFlowMemo = React.memo(DealFlow);

/**
 * `<EditDealConnected>` connects the EditDeal
 * component with the rest of the app (ie. routing, services, store, etc.).
 *
 * @param {object} props
 * @return {React.ReactElement}
 */
export function EditDealConnected({
  history,
  // location,
  match,
  searchDelay = 500,
}) {
  const id = match?.params?.id
  const api = useGraphQLService();
  const wait = useTimeout();

  const [saving/*, setSaving*/] = React.useState(false);

  const handleSave = React.useCallback(
    (deal, batch) => api.batchUpdateDeal(deal.id, batch),
    [api]
  );

  const onExit = React.useCallback(async () => {
    history.push(getRoute('DEALS'))
  }, [history])

  const onArtistSearch = React.useMemo(
    () => debouncePromise((term) => api.searchArtists(term), searchDelay),
    [api, searchDelay]
  )

  const onVenueSearch = React.useMemo(
    () => debouncePromise((term) => api.searchVenues(term), searchDelay),
    [api, searchDelay]
  )

  const onPersonSearch = React.useMemo(
    () => debouncePromise((term) => api.searchPeople(term), searchDelay),
    [api, searchDelay]
  )

  const onShare = React.useCallback(
    () => wait(() => toast.success('Your deal has been shared!'), 1000),
    [wait]
  )

  if (saving) return <PageLoader />;
  else {
    return (
      <WithDeps id={id}>
        {({ config, deal } ) => (
          <DealFlowMemo
            config={config}
            deal={deal}
            onSave={handleSave}
            onExit={onExit}
            onArtistSearch={onArtistSearch}
            onVenueSearch={onVenueSearch}
            onBuyerSearch={onPersonSearch}
            onCopromoterSearch={onPersonSearch}
            onShare={onShare}
            createDealURL={getRoute('CREATE_DEAL')}
          />
        )}
      </WithDeps>
    );
  }
}
