import React from 'react';

import { getRoute } from '~/routes';
import { PageLoader } from '~/components';
import { useGraphQLService } from '~/services';
import { debouncePromise } from '~/utils';
import { DealFlow } from '../deal-flow';

// import styles from './CreateDeal.module.scss';

/**
 * Get the application config and create an empty deal object that can be
 * populated by the subsequent steps of the deal flow.
 *
 * @param {object} props
 * @param {(config: object, deal: object) => React.ReactNode} props.children
 */
function WithDeps({
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
      api.createEmptyDeal()
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

export function CreateDeal({
  config,
  emptyDeal: deal,
  onSave,
  goToDealsPage,
  searchDelay = 500,
}) {
  // TODO Push this up
  const api = useGraphQLService();

  const handleSave = React.useCallback((deal, batch) => api.batchUpdateDeal(deal.id, batch), [api]);

  const onCancel = React.useCallback(async () => {
    try {
      await api.deleteDeal(deal.id);
    } catch (e) {
      console.error('Failed to delete deal object during cancel flow.', e);
    }
    goToDealsPage();
  }, [deal.id, api, goToDealsPage]);

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

  return (
    <DealFlowMemo
      config={config}
      deal={deal}
      onSave={handleSave}
      onCancel={onCancel}
      onExit={goToDealsPage}
      onArtistSearch={onArtistSearch}
      onVenueSearch={onVenueSearch}
      onBuyerSearch={onPersonSearch}
      onCopromoterSearch={onPersonSearch}
    />
  );
}

/**
 * `<CreateConnected>` connects the Create
 * component with the rest of the app (ie. routing, services, store, etc.).
 *
 * @param {object} props
 * @return {ReactElement}
 */
export function CreateDealConnected({
  history,
  // location,
  // match,
}) {
  const [saving, setSaving] = React.useState(false);

  if (saving) return <PageLoader />;
  else {
    return (
      <WithDeps>
        {({config, deal: emptyDeal}) =>
          <CreateDeal
            config={config}
            emptyDeal={emptyDeal}
            onSave={setSaving}
            goToDealsPage={() => history.push(getRoute('DEALS'))}
          />
        }
      </WithDeps>
    );
  }
}
