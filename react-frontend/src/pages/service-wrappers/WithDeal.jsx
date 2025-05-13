import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getRoute } from '~/routes';
import { useGraphQLService } from '~/services';
import { PageLoader } from '~/components';

/**
 * You can use this component to request deal details from the server and then
 * render your children with the deal data. The page loader is shown while the
 * request is processing. If the deal doesn't exist or an error occurs, the user
 * will be redirected to the deals list page.
 * @param {object} props
 * @param {string} [props.id]
 * @param {function} [props.children]
 */
export function WithDeal({
  id,
  children
}) {
  const api = useGraphQLService()
  const [deal, setDeal] = React.useState({})
  const [error, setError] = React.useState()

  React.useEffect(() => {
    api.getDeal(id)
      .then(deal => {
        if (deal) setDeal(deal)
        else setError(new Error(`Deal ${id} does not exist.`))
      })
      .catch(e => setError(e))
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!deal && !error) {
    return <PageLoader />
  } else if (error) {
    return <Redirect to={getRoute('DEALS')} />
  } else {
    return children(deal)
  }
}

WithDeal.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};
