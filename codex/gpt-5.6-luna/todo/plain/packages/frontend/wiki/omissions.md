# Recorded omissions

There are no product omissions for this frontend implementation. The
recovery confirmation screen intentionally requires the proof delivered by
the registered-email effect; the frontend cannot synthesize that proof without
violating the non-disclosure boundary. The backend recovery tests own the
delivery-effect fixture and proof-consumption verification. This recorded test
boundary is invalidated when a browser-test email transport or equivalent
delivery fixture becomes available to the frontend suite.
