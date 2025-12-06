// src/components/forms/ChannelForm.tsx

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Plus, Trash2 } from 'lucide-react'

// Tipe data untuk mempermudah manajemen state
interface Channel {
  id: string
  name: string
  isActive: boolean
}

interface SubChannel {
  id: string
  name: string
  channelId: string
  isActive: boolean
}

interface Partner {
  id: string
  name: string
  code: string
  commissionType: 'percentage' | 'fixed' | 'free-product' | 'none'
  commissionValue: number
  isActive: boolean
}

export default function ChannelForm() {
  // --- STATES ---
  // States untuk Channels
  const [channels, setChannels] = useState<Channel[]>([
    { id: 'online', name: 'Online', isActive: true },
    { id: 'offline', name: 'Offline', isActive: true }
  ])
  const [newChannelName, setNewChannelName] = useState('')

  // States untuk Sub-Channels
  const [subChannels, setSubChannels] = useState<SubChannel[]>([
    { id: 'grabfood', name: 'GrabFood', channelId: 'online', isActive: true },
    { id: 'shopeefood', name: 'Shopee Food', channelId: 'online', isActive: true },
    { id: 'gofood', name: 'GoFood', channelId: 'online', isActive: true },
    { id: 'socmed-ads', name: 'Social Media Ads', channelId: 'online', isActive: true },
    { id: 'organic-socmed', name: 'Organic Social Media', channelId: 'online', isActive: true },
    { id: 'reseller', name: 'Reseller', channelId: 'offline', isActive: true },
    { id: 'referral', name: 'Referral', channelId: 'offline', isActive: true },
    { id: 'direct', name: 'Direct', channelId: 'offline', isActive: true }
  ])
  const [newSubChannelName, setNewSubChannelName] = useState('')
  const [newSubChannelParentId, setNewSubChannelParentId] = useState('')

  // States untuk Resellers
  const [resellers, setResellers] = useState<Partner[]>([
    { id: 'reseller1', name: 'Reseller A', code: 'RSA', commissionType: 'percentage', commissionValue: 10, isActive: true },
    { id: 'reseller2', name: 'Reseller B', code: 'RSB', commissionType: 'percentage', commissionValue: 15, isActive: true },
    { id: 'reseller3', name: 'Reseller C', code: 'RSC', commissionType: 'fixed', commissionValue: 5000, isActive: true }
  ])
  const [newResellerName, setNewResellerName] = useState('')
  const [newResellerCode, setNewResellerCode] = useState('')
  const [newResellerCommissionType, setNewResellerCommissionType] = useState<'percentage' | 'fixed' | 'free-product' | 'none'>('percentage')
  const [newResellerCommissionValue, setNewResellerCommissionValue] = useState(0)

  // States untuk Referrals
  const [referrals, setReferrals] = useState<Partner[]>([
    { id: 'referral1', name: 'Referral A', code: 'RFA', commissionType: 'percentage', commissionValue: 5, isActive: true },
    { id: 'referral2', name: 'Referral B', code: 'RFB', commissionType: 'percentage', commissionValue: 7, isActive: true }
  ])
  const [newReferralName, setNewReferralName] = useState('')
  const [newReferralCode, setNewReferralCode] = useState('')
  const [newReferralCommissionType, setNewReferralCommissionType] = useState<'percentage' | 'fixed' | 'free-product' | 'none'>('percentage')
  const [newReferralCommissionValue, setNewReferralCommissionValue] = useState(0)

  // --- HANDLER FUNCTIONS ---
  const handleAddChannel = () => {
    if (newChannelName.trim()) {
      const newChannel: Channel = {
        id: newChannelName.toLowerCase().replace(/\s+/g, '-'),
        name: newChannelName,
        isActive: true
      }
      setChannels([...channels, newChannel])
      setNewChannelName('')
    }
  }

  const handleDeleteChannel = (channelId: string) => {
    setChannels(channels.filter(c => c.id !== channelId))
    setSubChannels(subChannels.filter(sc => sc.channelId !== channelId))
  }

  const handleToggleStatus = (list: Channel[] | SubChannel[] | Partner[], id: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
    setter(list.map(item => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ))
  }

  const handleAddSubChannel = () => {
    if (newSubChannelName.trim() && newSubChannelParentId) {
      const newSubChannel: SubChannel = {
        id: newSubChannelName.toLowerCase().replace(/\s+/g, '-'),
        name: newSubChannelName,
        channelId: newSubChannelParentId,
        isActive: true
      }
      setSubChannels([...subChannels, newSubChannel])
      setNewSubChannelName('')
      setNewSubChannelParentId('')
    }
  }

  const handleAddPartner = (
    name: string,
    code: string,
    commissionType: 'percentage' | 'fixed' | 'free-product' | 'none',
    commissionValue: number,
    list: Partner[],
    setter: React.Dispatch<React.SetStateAction<Partner[]>>
  ) => {
    if (name.trim() && code.trim()) {
      const newPartner: Partner = {
        id: code.toLowerCase().replace(/\s+/g, '-'),
        name,
        code,
        commissionType,
        commissionValue,
        isActive: true
      }
      setter([...list, newPartner])
      return true // Indicate success
    }
    return false // Indicate failure
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
            <CardDescription>Manage sales channels (Online/Offline)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <label htmlFor="new-channel" className="text-sm font-medium">New Channel</label>
                <Input id="new-channel" placeholder="e.g., Marketplace" value={newChannelName} onChange={(e) => setNewChannelName(e.target.value)} />
              </div>
              <Button onClick={handleAddChannel}><Plus className="h-4 w-4 mr-1" /> Add</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead><tr className="border-b"><th className="text-left p-2">Name</th><th className="text-left p-2">Status</th><th className="text-left p-2">Actions</th></tr></thead>
                <tbody>
                  {channels.map((channel) => (
                    <tr key={channel.id} className="border-b">
                      <td className="p-2">{channel.name}</td>
                      <td className="p-2"><span className={`px-2 py-1 rounded-full text-xs ${channel.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{channel.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td className="p-2">
                        <div className="flex space-x-2">
                           <Button variant="outline" size="sm" onClick={() => handleToggleStatus(channels, channel.id, setChannels)}>{channel.isActive ? 'Deactivate' : 'Activate'}</Button>
                           <Button variant="outline" size="sm" onClick={() => handleDeleteChannel(channel.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sub-Channels</CardTitle>
            <CardDescription>Manage specific sales sub-channels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end space-x-2">
              <div className="flex-1"><label className="text-sm font-medium">New Sub-Channel</label><Input placeholder="e.g., TikTok Shop" value={newSubChannelName} onChange={(e) => setNewSubChannelName(e.target.value)} /></div>
              <div className="w-48"><label className="text-sm font-medium">Parent Channel</label>
Select value={newSubChannelParentId} onValueChange={setNewSubChannelParentId}><SelectTrigger><SelectValue placeholder="Select channel" /></SelectTrigger><SelectContent>{channels.map((channel) => (<SelectItem key={channel.id} value={channel.id}>{channel.name}</SelectItem>))}</SelectContent></Select></div>
              <Button onClick={handleAddSubChannel}><Plus className="h-4 w-4 mr-1" /> Add</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead><tr className="border-b"><th className="text-left p-2">Name</th><th className="text-left p-2">Channel</th><th className="text-left p-2">Status</th><th className="text-left p-2">Actions</th></tr></thead>
                <tbody>
                  {subChannels.map((subChannel) => {
                    const parentChannel = channels.find(c => c.id === subChannel.channelId);
                    return (
                      <tr key={subChannel.id} className="border-b">
                        <td className="p-2">{subChannel.name}</td>
                        <td className="p-2">{parentChannel?.name || 'N/A'}</td>
                        <td className="p-2"><span className={`px-2 py-1 rounded-full text-xs ${subChannel.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{subChannel.isActive ? 'Active' : 'Inactive'}</span></td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleToggleStatus(subChannels, subChannel.id, setSubChannels)}>{subChannel.isActive ? 'Deactivate' : 'Activate'}</Button>
                            <Button variant="outline" size="sm" onClick={() => setSubChannels(subChannels.filter(sc => sc.id !== subChannel.id))}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="resellers" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Resellers</CardTitle>
            <CardDescription>Manage reseller information and commission structure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Input placeholder="Reseller Name" value={newResellerName} onChange={(e) => setNewResellerName(e.target.value)} />
              <Input placeholder="Unique Code" value={newResellerCode} onChange={(e) => setNewResellerCode(e.target.value)} />
              <Select value={newResellerCommissionType} onValueChange={(value: any) => setNewResellerCommissionType(value)}>
                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent><SelectItem value="percentage">Percentage</SelectItem><SelectItem value="fixed">Fixed</SelectItem><SelectItem value="free-product">Free Product</SelectItem><SelectItem value="none">None</SelectItem></SelectContent>
              </Select>
              <Input type="number" placeholder="Value" value={newResellerCommissionValue} onChange={(e) => setNewResellerCommissionValue(Number(e.target.value))} />
              <Button onClick={() => {
                if (handleAddPartner(newResellerName, newResellerCode, newResellerCommissionType, newResellerCommissionValue, resellers, setResellers)) {
                  setNewResellerName(''); setNewResellerCode(''); setNewResellerCommissionValue(0);
                }
              }}><Plus className="h-4 w-4 mr-1" /> Add</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead><tr className="border-b"><th className="text-left p-2">Name</th><th className="text-left p-2">Code</th><th className="text-left p-2">Commission</th><th className="text-left p-2">Status</th><th className="text-left p-2">Actions</th></tr></thead>
                <tbody>
                  {resellers.map((reseller) => (
                    <tr key={reseller.id} className="border-b">
                      <td className="p-2">{reseller.name}</td>
                      <td className="p-2">{reseller.code}</td>
                      <td className="p-2">{reseller.commissionType === 'percentage' ? `${reseller.commissionValue}%` : reseller.commissionType === 'fixed' ? `Rp ${reseller.commissionValue.toLocaleString()}` : reseller.commissionType}</td>
                      <td className="p-2"><span className={`px-2 py-1 rounded-full text-xs ${reseller.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{reseller.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td className="p-2">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleToggleStatus(resellers, reseller.id, setResellers)}>{reseller.isActive ? 'Deactivate' : 'Activate'}</Button>
                          <Button variant="outline" size="sm" onClick={() => setResellers(resellers.filter(r => r.id !== reseller.id))}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="referrals" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Referrals</CardTitle>
            <CardDescription>Manage referral partners and their commissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Input placeholder="Referral Name" value={newReferralName} onChange={(e) => setNewReferralName(e.target.value)} />
              <Input placeholder="Unique Code" value={newReferralCode} onChange={(e) => setNewReferralCode(e.target.value)} />
              <Select value={newReferralCommissionType} onValueChange={(value: any) => setNewReferralCommissionType(value)}>
                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent><SelectItem value="percentage">Percentage</SelectItem><SelectItem value="fixed">Fixed</SelectItem><SelectItem value="free-product">Free Product</SelectItem><SelectItem value="none">None</SelectItem></SelectContent>
              </Select>
              <Input type="number" placeholder="Value" value={newReferralCommissionValue} onChange={(e) => setNewReferralCommissionValue(Number(e.target.value))} />
              <Button onClick={() => {
                if (handleAddPartner(newReferralName, newReferralCode, newReferralCommissionType, newReferralCommissionValue, referrals, setReferrals)) {
                  setNewReferralName(''); setNewReferralCode(''); setNewReferralCommissionValue(0);
                }
              }}><Plus className="h-4 w-4 mr-1" /> Add</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead><tr className="border-b"><th className="text-left p-2">Name</th><th className="text-left p-2">Code</th><th className="text-left p-2">Commission</th><th className="text-left p-2">Status</th><th className="text-left p-2">Actions</th></tr></thead>
                <tbody>
                  {referrals.map((referral) => (
                    <tr key={referral.id} className="border-b">
                      <td className="p-2">{referral.name}</td>
                      <td className="p-2">{referral.code}</td>
                      <td className="p-2">{referral.commissionType === 'percentage' ? `${referral.commissionValue}%` : referral.commissionType === 'fixed' ? `Rp ${referral.commissionValue.toLocaleString()}` : referral.commissionType}</td>
                      <td className="p-2"><span className={`px-2 py-1 rounded-full text-xs ${referral.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{referral.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td className="p-2">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleToggleStatus(referrals, referral.id, setReferrals)}>{referral.isActive ? 'Deactivate' : 'Activate'}</Button>
                          <Button variant="outline" size="sm" onClick={() => setReferrals(referrals.filter(r => r.id !== referral.id))}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
