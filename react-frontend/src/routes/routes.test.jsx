import {
  getRoute,
  doesURLMatch,
  normalizeParam,
  normalizeAllParams,
  getRouteParam,
  getAllRouteParams,
  getQueryParam,
  getAllQueryParams,
  findRouteMatchingLocation,
} from './routes';

describe('Routes', () => {
  let routes;

  beforeEach(() => {
    routes = new Map([
      [ 'A', {title: 'Page A',   path : '/foo'} ],
      [ 'B', {title: 'Page B',   path : '/foo/bar/:id'} ],
      [ 'C', {title: 'Page C',   path : '/baz/:id/:other'} ],
    ]);
  });

  describe('getRoute', () => {
    it('should be able to find a route by name.', () => {
      expect(getRoute('HOME')).toEqual('/');
      expect(getRoute('A', null, null, routes)).toEqual('/foo')
    });

    it('should be able to replace route parameters in the route.', () => {
      const id = 82729981;
      const other = 2093;

      expect(getRoute('B', {id}, null, routes))
        .toEqual(`/foo/bar/${id}`);
      expect(getRoute('C', {id, other}, null, routes))
        .toEqual(`/baz/${id}/${other}`);
    });

    it('should be able to append query parameters to the route.', () => {
      const id = 82729981;
      const other = 280392;
      const from = 'last';
      const to = 'next';

      expect(getRoute('C', {id, other}, {from, to}, routes))
        .toEqual(`/baz/${id}/${other}?from=${from}&to=${to}`);
    });
  });

  describe('normalizeParam', () => {
    it('should be able to normalize id parameters.', () => {
      expect(normalizeParam('fooId', '123')).toEqual(123);
    });

    it('should be able to normalize count parameters.', () => {
      expect(normalizeParam('barCount', '123')).toEqual(123);
    });

    it('should not change unrecognized parameters.', () => {
      expect(normalizeParam('fooBar', '123')).toEqual('123');
    });
  });

  describe('normalizeAllParams', () => {
    it('should normalize all parameters in a param object.', () => {
      const params = {
        fooCount: '7',
        barId: '8235',
        baz: '7783',
      };

      expect(normalizeAllParams(params)).toEqual({
        fooCount: 7,
        barId: 8235,
        baz: '7783',
      });
    });
  });

  describe('getRouteParam', () => {
    it('should be able to get the normalized value of a route param from a param object.', () => {
      const params = {
        fooCount: '7',
        barId: '8235',
        baz: '7783',
      };

      expect(getRouteParam('fooCount', params))
        .toEqual(7);
      expect(getRouteParam('baz', params))
        .toEqual('7783');
    });

    it('should be able to get the normalized value of a route param from an object with a params property.', () => {
      const params = {
        fooCount: '7',
        barId: '8235',
        baz: '7783',
      };
      const match = { params };

      expect(getRouteParam('fooCount', match))
        .toEqual(7);
      expect(getRouteParam('baz', match))
        .toEqual('7783');
    });
  });

  describe('getAllRouteParams', () => {
    it('should be able to normalize all values in a match object.', () => {
      const params = {
        fooCount: '7',
        barId: '8235',
        baz: '7783',
      };
      const match = { params };

      expect(getAllRouteParams(match)).toEqual({
        fooCount: 7,
        barId: 8235,
        baz: '7783',
      });
    });
  });

  describe('getQueryParam', () => {
    it('should be able to get the normalized value of a query parameter from a query string.', () => {
      const query = '?fooCount=7&barId=8235&baz=7783';
      expect(getQueryParam('fooCount', query))
        .toEqual(7);
      expect(getQueryParam('baz', query))
        .toEqual('7783');
    });
  });

  describe('getAllQueryParams', () => {
    it('should be able to get all normalized values from a query string.', () => {
      const query = '?fooCount=7&barId=8235&baz=7783';
      expect(getAllQueryParams(query)).toEqual({
        fooCount: 7,
        barId: 8235,
        baz: '7783',
      });
    });
  });

  describe('findRouteMatchingLocation', () => {
    it('should be able to find a route from the browser url.', () => {
      const result = findRouteMatchingLocation('/foo', routes);

      expect(result.key).toEqual('A');
      expect(result.route).toEqual(routes.get('A'));
      expect(result.match).toEqual(expect.objectContaining({
        url: '/foo',
        params: {},
      }));
    });
  });

  describe('doesURLMatch', () => {
    it('should be able to determine if URLs in a list match the location provided.', () => {
      expect(doesURLMatch('/foo/bar', ['/', '/bar', '/foo/bar'])).toBe(true);
      expect(doesURLMatch('/foo/bar', '/foo/bar')).toBe(true);
      expect(doesURLMatch('/foo/bar', ['/', '/bar', '/bar/foo'])).toBe(false);
    });
  });
});
