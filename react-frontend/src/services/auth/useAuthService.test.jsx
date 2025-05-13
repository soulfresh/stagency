import React from 'react'
import { render, act, mostRecentCall } from '~/test'
import { AuthServiceMock, generateAuth } from './mocks'
import { useAuthService } from './useAuthService'

describe('useAuthService', () => {
  let auth, children

  const Example = ({ client }) => {
    const result = useAuthService(client, false)
    // useLogPropChanges(result, '[Example]')
    // console.log('[Example]', result)

    children(result)
    return null
  }

  beforeEach(() => {
    children = jest.fn()
  })

  describe("before the user's authenticated state is known", () => {
    beforeEach(() => {
      auth = new AuthServiceMock()
      jest
        .spyOn(auth, 'authenticate')
        .mockImplementation(() => new Promise(() => {}))

      render(<Example client={auth} />)
    })

    it('should indicate that auth is loading and uninitialized.', () => {
      expect(children).toHaveBeenCalledTimes(1)
      expect(children).toHaveBeenCalledWith({
        startup: true,
        initialized: false,
        authenticated: false,
        loading: true,
        authResponse: undefined,
        onLogin: expect.any(Function),
        onRefreshLogin: expect.any(Function),
        onLogout: expect.any(Function),
      })
    })

    it("should request the user's auth state.", () => {
      expect(auth.authenticate).toHaveBeenCalledTimes(1)
    })
  })

  describe('initially logged in', () => {
    let authResponse

    beforeEach(async () => {
      authResponse = generateAuth.authResponse()
      const promise = Promise.resolve(authResponse)

      auth = new AuthServiceMock(true)
      jest.spyOn(auth, 'authenticate').mockReturnValue(promise)

      render(<Example client={auth} />)

      await act(async () => promise)
    })

    it('should indicate that auth is initialized and the user logged in.', () => {
      expect(children).toHaveBeenCalledWith({
        startup: false,
        initialized: true,
        authenticated: true,
        loading: false,
        authResponse: authResponse,
        onLogin: expect.any(Function),
        onRefreshLogin: expect.any(Function),
        onLogout: expect.any(Function),
      })
    })

    describe('after calling the onRefreshLogin callback', () => {
      beforeEach(() => {
        const { onRefreshLogin } = mostRecentCall(children)[0]
        jest.spyOn(auth, 'login').mockReturnValue(new Promise(() => {}))

        children.mockClear()
        act(() => {
          onRefreshLogin()
        })
      })

      it('should indicate that auth is initialized and loading.', () => {
        expect(children).toHaveBeenCalledTimes(1)
        expect(children).toHaveBeenCalledWith({
          startup: false,
          initialized: true,
          authenticated: false,
          loading: true,
          authResponse: null,
          onLogin: expect.any(Function),
          onRefreshLogin: expect.any(Function),
          onLogout: expect.any(Function),
        })
      })

      describe('and then calling onLogout while onReshlogin is still waiting', () => {
        it('should throw an error.', async () => {
          const { onLogin } = mostRecentCall(children)[0]
          await act(async () => {
            await expect(onLogin()).rejects.toThrow()
          })
        })
      })
    })

    describe('after onRefreshLogin succeeds', () => {
      let refreshResponse

      beforeEach(async () => {
        const { onRefreshLogin } = mostRecentCall(children)[0]
        refreshResponse = generateAuth.authResponse()
        const promise = Promise.resolve(refreshResponse)

        jest.spyOn(auth, 'login').mockReturnValue(promise)
        children.mockClear()

        await act(async () => {
          onRefreshLogin()
          await promise
        })
      })

      it('should indicate that the user is logged in.', () => {
        expect(children).toHaveBeenCalledWith({
          startup: false,
          initialized: true,
          authenticated: true,
          loading: false,
          authResponse: refreshResponse,
          onLogin: expect.any(Function),
          onRefreshLogin: expect.any(Function),
          onLogout: expect.any(Function),
        })
      })
    })

    describe('after onRefreshLogin fails', () => {
      beforeEach(async () => {
        const { onRefreshLogin } = mostRecentCall(children)[0]
        children.mockClear()

        jest
          .spyOn(auth, 'login')
          .mockImplementation(() => Promise.reject(false))

        await act(async () => onRefreshLogin())
      })

      it('should indicate that the user is logged out but auth is initialized.', () => {
        expect(children).toHaveBeenCalledWith({
          startup: false,
          initialized: true,
          authenticated: false,
          loading: false,
          authResponse: null,
          onLogin: expect.any(Function),
          onRefreshLogin: expect.any(Function),
          onLogout: expect.any(Function),
        })
      })
    })

    describe('after calling the onLogout method', () => {
      beforeEach(() => {
        const { onLogout } = mostRecentCall(children)[0]
        jest.spyOn(auth, 'logout').mockReturnValue(new Promise(() => {}))
        children.mockClear()

        act(() => {
          onLogout()
        })
      })

      it('should show the login screen immediately.', () => {
        expect(children).toHaveBeenCalledWith({
          startup: false,
          initialized: false,
          authenticated: false,
          loading: true,
          authResponse: null,
          onLogin: expect.any(Function),
          onRefreshLogin: expect.any(Function),
          onLogout: expect.any(Function),
        })
      })

      it('should log the user out of Auth0.', () => {
        expect(auth.logout).toHaveBeenCalledTimes(1)
      })

      describe('and then calling onLogin while onRefreshLogin is still waiting', () => {
        it('should throw an error.', async () => {
          const { onLogin } = mostRecentCall(children)[0]
          await act(async () => {
            await expect(onLogin()).rejects.toThrow()
          })
        })
      })
    })

    describe('after the onLogout request succeeds', () => {
      beforeEach(async () => {
        const { onLogout } = mostRecentCall(children)[0]
        jest.spyOn(auth, 'logout').mockReturnValue(Promise.resolve(true))
        children.mockClear()
        // eslint-disable-next-line @typescript-eslint/return-await
        await act(async () => await onLogout())
      })

      it('should indicate that auth is nolonger initialized and the user logged out.', () => {
        expect(children).toHaveBeenCalledWith({
          startup: false,
          initialized: false,
          authenticated: false,
          loading: false,
          authResponse: null,
          onLogin: expect.any(Function),
          onRefreshLogin: expect.any(Function),
          onLogout: expect.any(Function),
        })
      })
    })

    describe('after the onLogout request fails', () => {
      beforeEach(async () => {
        const { onLogout } = mostRecentCall(children)[0]
        children.mockClear()

        jest
          .spyOn(auth, 'login')
          .mockImplementation(() => Promise.reject(false))

        await act(async () => onLogout())
      })

      it('should indicate that auth is initialized and the user logged out.', () => {
        expect(children).toHaveBeenCalledWith({
          startup: false,
          initialized: false,
          authenticated: false,
          loading: false,
          authResponse: null,
          onLogin: expect.any(Function),
          onRefreshLogin: expect.any(Function),
          onLogout: expect.any(Function),
        })
      })
    })

    describe("after the user's session expires", () => {
      describe('and the auth refresh succeeds', () => {
        xit('should indicate that the user is still logged in.', () => {})
      })
      describe('and the auth refresh fails', () => {
        xit('should indicate that the user is logged out.', () => {})
        xit('should maintain the initialized state.', () => {})
      })
    })
  })

  describe('initially logged out', () => {
    beforeEach(async () => {
      const promise = Promise.reject(false)

      auth = new AuthServiceMock(false)
      jest.spyOn(auth, 'authenticate').mockReturnValue(promise)

      render(<Example client={auth} />)

      await act(async () => promise.catch(() => {}))
    })

    it('should indicate that auth is initialized and the user logged out.', () => {
      expect(children).toHaveBeenCalledWith({
        startup: false,
        initialized: false,
        authenticated: false,
        loading: false,
        authResponse: null,
        onLogin: expect.any(Function),
        onRefreshLogin: expect.any(Function),
        onLogout: expect.any(Function),
      })
    })

    describe('after calling the onLogin method', () => {
      beforeEach(() => {
        const { onLogin } = mostRecentCall(children)[0]
        jest.spyOn(auth, 'login').mockReturnValue(new Promise(() => {}))
        children.mockClear()

        act(() => {
          onLogin()
        })
      })

      it('should indicate that auth is uninitialized and the user is still logged out.', () => {
        expect(children).toHaveBeenCalledWith({
          startup: false,
          initialized: false,
          authenticated: false,
          loading: true,
          authResponse: null,
          onLogin: expect.any(Function),
          onRefreshLogin: expect.any(Function),
          onLogout: expect.any(Function),
        })
      })

      it('should call the auth service login method.', () => {
        expect(auth.login).toHaveBeenCalledTimes(1)
      })

      describe('and then calling onLogout while onLogin is still waiting', () => {
        it('should throw an error.', async () => {
          const { onLogout } = mostRecentCall(children)[0]
          await act(async () => {
            await expect(onLogout()).rejects.toThrow()
          })
        })
      })
    })

    describe('after the onLogin method succeeds', () => {
      let authResponse

      beforeEach(async () => {
        authResponse = generateAuth.authResponse()
        const { onLogin } = mostRecentCall(children)[0]
        jest.spyOn(auth, 'login').mockReturnValue(Promise.resolve(authResponse))
        children.mockClear()
        // eslint-disable-next-line @typescript-eslint/return-await
        await act(async () => await onLogin())
      })

      it('should indicate that the auth is initialized and the user logged in.', () => {
        expect(children).toHaveBeenCalledWith({
          startup: false,
          initialized: true,
          authenticated: true,
          loading: false,
          authResponse: authResponse,
          onLogin: expect.any(Function),
          onRefreshLogin: expect.any(Function),
          onLogout: expect.any(Function),
        })
      })
    })

    describe('after the onLogin method fails', () => {
      beforeEach(async () => {
        const { onLogin } = mostRecentCall(children)[0]
        jest
          .spyOn(auth, 'login')
          .mockImplementation(() => Promise.reject(false))
        children.mockClear()
        // eslint-disable-next-line @typescript-eslint/return-await
        await act(async () => await onLogin())
      })

      it('should indicate that the auth is uninitialized and the user is still logged out.', () => {
        expect(children).toHaveBeenCalledWith({
          startup: false,
          initialized: false,
          authenticated: false,
          loading: false,
          authResponse: null,
          onLogin: expect.any(Function),
          onRefreshLogin: expect.any(Function),
          onLogout: expect.any(Function),
        })
      })
    })
  })
})
