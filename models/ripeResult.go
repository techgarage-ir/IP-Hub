package models

type RipeResult struct {
	Messages       []any  `json:"messages"`
	SeeAlso        []any  `json:"see_also"`
	Version        string `json:"version"`
	DataCallName   string `json:"data_call_name"`
	DataCallStatus string `json:"data_call_status"`
	Cached         bool   `json:"cached"`
	Data           struct {
		QueryTime string `json:"query_time"`
		Resources struct {
			Asn  []string `json:"asn"`
			Ipv4 []string `json:"ipv4"`
			Ipv6 []string `json:"ipv6"`
		} `json:"resources"`
	} `json:"data"`
	QueryID      string `json:"query_id"`
	ProcessTime  int    `json:"process_time"`
	ServerID     string `json:"server_id"`
	BuildVersion string `json:"build_version"`
	Status       string `json:"status"`
	StatusCode   int    `json:"status_code"`
	Time         string `json:"time"`
}
