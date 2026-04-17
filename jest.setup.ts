import '@testing-library/jest-dom'

if (typeof globalThis.Headers === 'undefined') {
  class HeadersPolyfill {
    private readonly store: Record<string, string> = {}

    set(name: string, value: string): void {
      this.store[name.toLowerCase()] = value
    }

    get(name: string): string | null {
      return this.store[name.toLowerCase()] ?? null
    }
  }

  ;(globalThis as unknown as { Headers: typeof HeadersPolyfill }).Headers = HeadersPolyfill
}

if (typeof globalThis.Request === 'undefined') {
  class RequestPolyfill {
    public readonly url: string

    constructor(input: string | { url: string }) {
      this.url = typeof input === 'string' ? input : input.url
    }
  }

  ;(globalThis as unknown as { Request: typeof RequestPolyfill }).Request = RequestPolyfill
}

if (typeof globalThis.Response === 'undefined') {
  class ResponsePolyfill {
    public readonly ok: boolean
    public readonly status: number
    public readonly statusText: string
    private readonly payload: unknown

    constructor(payload: unknown = null, init?: { status?: number; statusText?: string }) {
      this.payload = payload
      this.status = init?.status ?? 200
      this.statusText = init?.statusText ?? 'OK'
      this.ok = this.status >= 200 && this.status < 300
    }

    static json(
      payload: unknown,
      init?: { status?: number; statusText?: string },
    ): ResponsePolyfill {
      return new ResponsePolyfill(payload, init)
    }

    async json(): Promise<unknown> {
      return this.payload
    }
  }

  ;(globalThis as unknown as { Response: typeof ResponsePolyfill }).Response = ResponsePolyfill
}

afterEach((): void => {
  jest.restoreAllMocks()
})
