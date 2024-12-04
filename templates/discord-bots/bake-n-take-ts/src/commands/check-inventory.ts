import { Treat } from '../core/treats.js'
import { ChatInputCommandInteraction, Colors } from 'discord.js'
import { Flashcore } from 'robo.js'

export default async (interaction: ChatInputCommandInteraction) => {
	const balance = (await Flashcore.get<number>('balance', { namespace: interaction.user.id })) ?? 0
	const inventory = (await Flashcore.get<Treat[]>('inventory', { namespace: interaction.user.id })) ?? []

	// Group the treats by name and count (prevents duplicates)
	const treats: Record<string, Treat & { count: number }> = {}

	inventory.forEach((treat) => {
		if (!(treat.name in treats)) {
			treats[treat.name] = { ...treat, count: 0 }
		}

		treats[treat.name].count++
	})

	return {
		embeds: [
			{
				color: Colors.DarkGreen,
				description: `You have $${balance.toFixed(2)} in your account`,
				title: 'Inventory',
				fields: Object.values(treats).map((treat) => ({
					name: `${treat.name} (${treat.count})`,
					value: `Price: $${treat.price.toFixed(2)} each`
				}))
			}
		]
	}
}