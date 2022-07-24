const process = require('process');
module.exports=class TokenBucketRateLimiter {
    constructor ({ maxRequests, maxRequestWindowMS }) {
      this.maxRequests = maxRequests
      this.maxRequestWindowMS = maxRequestWindowMS
      this.reset()
    }
     sleep (milliseconds) {
        return new Promise((resolve) => setTimeout(resolve, milliseconds))
      }
    reset () {
      this.count = 0
      this.resetTimeout = null
    }
  
    scheduleReset () {
      // Only the first token in the set triggers the resetTimeout
      if (!this.resetTimeout) {
        this.resetTimeout = setTimeout(() => (
          this.reset()
        ), this.maxRequestWindowMS)
      }
    }
  
    async acquireToken (fn) {
      this.scheduleReset()
    
    
      if (this.count === this.maxRequests) {
          // sleeping for certain milisecond window
        await this.sleep(this.maxRequestWindowMS)
       
        return this.acquireToken(fn)
      }
     
      this.count += 1
      await process.nextTick(() => {
        console.log('Executed in the next iteration');
      })
      return fn()
    }
  }
  