package pluginBase

type Lookup struct {
	CountryCode string
	CountryName string
	ASN         []string
	IPv4        []string
	IPv6        []string
	UpdatedAt   string
}

type IPVersion string

const (
	Any  IPVersion = "any"
	IPv4 IPVersion = "ipv4"
	IPv6 IPVersion = "ipv6"
)

type Plugin interface {
	// GetID returns the unique identifier of the plugin
	GetID() string

	// GetName returns the display name of the plugin
	GetName() string

	// Format processes the lookup data and returns a formatted string
	// based on the specified IP version filter
	Format(lookup Lookup, version IPVersion, access bool) string
}

// BasePlugin provides a basic implementation of the Plugin interface
type BasePlugin struct {
	id   string
	name string
}

// NewBasePlugin creates a new BasePlugin instance
func NewBasePlugin(id, name string) *BasePlugin {
	return &BasePlugin{
		id:   id,
		name: name,
	}
}

func (b *BasePlugin) GetID() string   { return b.id }
func (b *BasePlugin) GetName() string { return b.name }
