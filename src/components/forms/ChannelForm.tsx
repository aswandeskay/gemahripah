import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Plus, Trash2, Edit, Save } from 'lucide-react'

// Sample channel data
const [channels, setChannels] = useState([
  { id: 'online', name: 'Online', isActive: true },
  { id: 'offline', name: 'Offline', isActive: true }
])

// Sample sub-channel data
const [subChannels, setSubChannels] = useState([
  { id: 'grabfood', name: 'GrabFood', channelId: 'online', isActive: true },
  { id: 'shopeefood', name: 'Shopee Food', channelId: 'online', isActive: true },
  { id: 'gofood', name: 'GoFood', channelId: 'online', isActive: true },
  { id: 'socmed-ads', name: 'Social Media Ads', channelId: 'online', isActive: true },
  { id: 'organic-socmed', name: 'Organic Social Media', channelId: 'online', isActive: true },
  { id: 'reseller', name: 'Reseller', channelId: 'offline', isActive: true },
  { id: 'referral', name: 'Referral', channelId: 'offline', isActive: true },
  { id: 'direct', name: 'Direct', channelId: 'offline', isActive: true }
])

// Sample reseller data
const [resellers, setResellers] = useState([
  { id: 'reseller1', name: 'Reseller A', code: 'RSA', commissionType: 'percentage', commissionValue: 10, isActive: true },
  { id: 'reseller2', name: 'Reseller B', code: 'RSB', commissionType: 'percentage', commissionValue: 15, isActive: true },
  { id: 'reseller3', name: 'Reseller C', code: 'RSC', commissionType: 'fixed', commissionValue: 5000, isActive: true }
])

// Sample referral data
const [referrals, setReferrals] = useState([
  { id: 'referral1', name: 'Referral A', code: 'RFA', commissionType: 'percentage', commissionValue: 5, isActive: true },
  { id: 'referral2', name: 'Referral B', code: 'RFB', commissionType: 'percentage', commissionValue: 7, isActive: true }
])

// Form states
const [newChannelName, setNewChannelName] = useState('')
const [newSubChannelName, setNewSubChannelName] = useState('')
const [newSubChannelId, setNewSubChannelId] = useState('')
const [newResellerName, setNewResellerName] = useState('')
const [newResellerCode, setNewResellerCode] = useState('')
const [newResellerCommissionType, setNewResellerCommissionType] = useState('percentage')
const [newResellerCommissionValue, setNewResellerCommissionValue] = useState(0)
const [newReferralName, setNewReferralName] = useState('')
const [newReferralCode, setNewReferralCode] = useState('')
const [newReferralCommissionType, setNewReferralCommissionType] = useState('percentage')
const [newReferralCommissionValue, setNewReferralCommissionValue] = useState(0)

// Edit states
const [editingChannelId, setEditingChannelId] = useState('')
const [editingSubChannelId, setEditingSubChannelId] = useState('')
const [editingResellerId, setEditingResellerId] = useState('')
const [editingReferralId, setEditingReferralId] = useState('')

export default function ChannelForm() {
  // Handle channel operations
  const handleAddChannel = () => {
    if (newChannelName.trim()) {
      const newChannel = {
        id: newChannelName.toLowerCase().replace(/\s+/g, '-'),
        name: newChannelName,
        isActive: true
      }
      setChannels([...channels, newChannel])
      setNewChannelName('')
    }
  }

  const handleToggleChannelStatus = (channelId: string) => {
    setChannels(channels.map(channel => 
      channel.id === channelId 
        ? { ...channel, isActive: !channel.isActive }
        : channel
    ))
  }

  const handleDeleteChannel = (channelId: string) => {
    setChannels(channels.filter(channel => channel.id !== channelId))
    setSubChannels(subChannels.filter(subChannel => subChannel.channelId !== channelId))
  }

  // Handle sub-channel operations
  const handleAddSubChannel = () => {
    if (newSubChannelName.trim() && newSubChannelId) {
      const newSubChannel = {
        id: newSubChannelId.toLowerCase().replace(/\s+/g, '-'),
        name: newSubChannelName,
        channelId: newSubChannelId,
        isActive: true
      }
      setSubChannels([...subChannels, newSubChannel])
      setNewSubChannelName('')
      setNewSubChannelId('')
    }
  }

  const handleToggleSubChannelStatus = (subChannelId: string) => {
    setSubChannels(subChannels.map(subChannel => 
      subChannel.id === subChannelId 
        ? { ...subChannel, isActive: !subChannel.isActive }
        : subChannel
    ))
  }

  const handleDeleteSubChannel = (subChannelId: string) => {
    setSubChannels(subChannels.filter(subChannel => subChannel.id !== subChannelId))
  }

  // Handle reseller operations
  const handleAddReseller = () => {
    if (newResellerName.trim() && newResellerCode.trim()) {
      const newReseller = {
        id: newResellerCode.toLowerCase().replace(/\s+/g, '-'),
        name: newResellerName,
        code: newResellerCode,
        commissionType: newResellerCommissionType,
        commissionValue: newResellerCommissionValue,
        isActive: true
      }
      setResellers([...resellers, newReseller])
      setNewResellerName('')
      setNewResellerCode('')
      setNewResellerCommissionValue(0)
    }
  }

  const handleToggleResellerStatus = (resellerId: string) => {
    setResellers(resellers.map(reseller => 
      reseller.id === resellerId 
        ? { ...reseller, isActive: !reseller.isActive }
        : reseller
    ))
  }

  const handleDeleteReseller = (resellerId: string) => {
    setResellers(resellers.filter(reseller => reseller.id !== resellerId))
  }

  // Handle referral operations
  const handleAddReferral = () => {
    if (newReferralName.trim() && newReferralCode.trim()) {
      const newReferral = {
        id: newReferralCode.toLowerCase().replace(/\s+/g, '-'),
        name: newReferralName,
        code: newReferralCode,
        commissionType: newReferralCommissionType,
        commissionValue: newReferralCommissionValue,
        isActive: true
      }
      setReferrals([...referrals, newReferral])
      setNewReferralName('')
      setNewReferralCode('')
      setNewReferralCommissionValue(0)
    }
  }

  const handleToggleReferralStatus = (referralId: string) => {
    setReferrals(referrals.map(referral => 
      referral.id === referralId 
        ? { ...referral, isActive: !referral.isActive }
        : referral
    ))
  }

  const handleDeleteReferral = (referralId: string) => {
    setReferrals(referrals.filter(referral => referral.id !== referralId))
  }

  return (
    <Tabs defaultValue="channels" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="channels">Channels</TabsTrigger>
        <TabsTrigger value="resellers">Resellers</TabsTrigger>
        <TabsTrigger value="referrals">Referrals</TabsTrigger>
      </TabsList>
      
      <TabsContent value="channels" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Channels</CardTitle>
            <CardDescription>Manage sales channels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <label htmlFor="new-channel" className="text-sm font-medium">
                    New Channel
                  </label>
                  <Input
                    id="new-channel"
                    placeholder="Enter channel name"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddChannel}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {channels.map((channel) => (
                      <tr key={channel.id} className="border-b">
                        <td className="p-2">{channel.name}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            channel.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {channel.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleChannelStatus(channel.id)}
                            >
                              {channel.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteChannel(channel.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sub-Channels</CardTitle>
            <CardDescription>Manage sales sub-channels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <label htmlFor="new-subchannel" className="text-sm font-medium">
                    New Sub-Channel
                  </label>
                  <Input
                    id="new-subchannel"
                    placeholder="Enter sub-channel name"
                    value={newSubChannelName}
                    onChange={(e) => setNewSubChannelName(e.target.value)}
                  />
                </div>
                <div className="w-48">
                  <label htmlFor="channel-select" className="text-sm font-medium">
                    Channel
                  </label>
                  <Select value={newSubChannelId} onValueChange={setNewSubChannelId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                    <SelectContent>
                      {channels.map((channel) => (
                        <SelectItem key={channel.id} value={channel.id}>
                          {channel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddSubChannel}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Channel</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subChannels.map((subChannel) => {
                      const channel = channels.find(c => c.id === subChannel.channelId)
                      return (
                        <tr key={subChannel.id} className="border-b">
                          <td className="p-2">{subChannel.name}</td>
                          <td className="p-2">{channel?.name}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              subChannel.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {subChannel.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-2">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleSubChannelStatus(subChannel.id)}
                              >
                                {subChannel.isActive ? 'Deactivate' : 'Activate'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteSubChannel(subChannel.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="resellers" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Resellers</CardTitle>
            <CardDescription>Manage reseller information and commission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label htmlFor="reseller-name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="reseller-name"
                    placeholder="Enter reseller name"
                    value={newResellerName}
                    onChange={(e) => setNewResellerName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="reseller-code" className="text-sm font-medium">
                    Code
                  </label>
                  <Input
                    id="reseller-code"
                    placeholder="Enter reseller code"
                    value={newResellerCode}
                    onChange={(e) => setNewResellerCode(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="commission-type" className="text-sm font-medium">
                    Commission Type
                  </label>
                  <Select value={newResellerCommissionType} onValueChange={setNewResellerCommissionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="free-product">Free Product</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="commission-value" className="text-sm font-medium">
                    Commission Value
                  </label>
                  <Input
                    id="commission-value"
                    type="number"
                    placeholder="Enter value"
                    value={newResellerCommissionValue}
                    onChange={(e) => setNewResellerCommissionValue(Number(e.target.value))}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddReseller}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Code</th>
                      <th className="text-left p-2">Commission</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resellers.map((reseller) => (
                      <tr key={reseller.id} className="border-b">
                        <td className="p-2">{reseller.name}</td>
                        <td className="p-2">{reseller.code}</td>
                        <td className="p-2">
                          {reseller.commissionType === 'percentage' && `${reseller.commissionValue}%`}
                          {reseller.commissionType === 'fixed' && `Rp ${reseller.commissionValue.toLocaleString()}`}
                          {reseller.commissionType === 'free-product' && 'Free Product'}
                          {reseller.commissionType === 'none' && 'None'}
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            reseller.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {reseller.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleResellerStatus(reseller.id)}
                            >
                              {reseller.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteReseller(reseller.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="referrals" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Referrals</CardTitle>
            <CardDescription>Manage referral information and commission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label htmlFor="referral-name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="referral-name"
                    placeholder="Enter referral name"
                    value={newReferralName}
                    onChange={(e) => setNewReferralName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="referral-code" className="text-sm font-medium">
                    Code
                  </label>
                  <Input
                    id="referral-code"
                    placeholder="Enter referral code"
                    value={newReferralCode}
                    onChange={(e) => setNewReferralCode(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="referral-commission-type" className="text-sm font-medium">
                    Commission Type
                  </label>
                  <Select value={newReferralCommissionType} onValueChange={setNewReferralCommissionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="free-product">Free Product</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="referral-commission-value" className="text-sm font-medium">
                    Commission Value
                  </label>
                  <Input
                    id="referral-commission-value"
                    type="number"
                    placeholder="Enter value"
                    value={newReferralCommissionValue}
                    onChange={(e) => setNewReferralCommissionValue(Number(e.target.value))}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddReferral}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Code</th>
                      <th className="text-left p-2">Commission</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map((referral) => (
                      <tr key={referral.id} className="border-b">
                        <td className="p-2">{referral.name}</td>
                        <td className="p-2">{referral.code}</td>
                        <td className="p-2">
                          {referral.commissionType === 'percentage' && `${referral.commissionValue}%`}
                          {referral.commissionType === 'fixed' && `Rp ${referral.commissionValue.toLocaleString()}`}
                          {referral.commissionType === 'free-product' && 'Free Product'}
                          {referral.commissionType === 'none' && 'None'}
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            referral.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {referral.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleReferralStatus(referral.id)}
                            >
                              {referral.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteReferral(referral.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
