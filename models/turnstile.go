package models

import "time"

type TurnstileResponse struct {
	Success     bool      `json:"success"`
	ErrorCodes  []any     `json:"error-codes"`
	ChallengeTs time.Time `json:"challenge_ts"`
	Hostname    string    `json:"hostname"`
}
